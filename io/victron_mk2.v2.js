var SerialPort = require('serialport');
var bp = require('bufferpack');

const EventEmitter = require('events');
class Mk2_emitter extends EventEmitter {}
const mk2_emitter = new Mk2_emitter();

  
// Modul Variablen

function victron_mk2 () {
    var self = this;
    var debug_log = false;
    var in_buf = new Buffer('');  // input buffer
    var recive         = () => {};   // common callback pointer
    var recive_resolve = () => {}
    var data;        // data container
    this.test = { name: "abc"}
    
    //self.data = mk2.data;
    self.close = function () {
        port.close();
    }

    // open serial port
    var port = new SerialPort('/dev/ttyUSB1', {
        baudRate: 2400,
       // parser: SerialPort.parsers.byteDelimiter([255])
    }, (error) => {

        if (!error) {
            console.log("mk2-dtr: on");
    
            // activate interface
            port.set({
                "dtr": true,
                "rts": false,
                "cts": false,
                "dts": false,
                "brk": false,
            })
            setTimeout(() => {
                run();
            },500)
        } else {
            // ERROR
            console.log ("mk2 open port error: ", error)
        }
    });
    
    // helper function
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function frame_debug (txt, frame, data) {
        if (debug_log) {
            console.log("-------------------------------------------------------------------------------------")
            console.log (txt, frame);
            var legend = "       ";
            for (i=0;i<frame.length;i++) {
                legend += i.toString().padStart(3, " ")
            }
            console.log (txt, legend)
            if (data) console.log(data)
            console.log("-------------------------------------------------------------------------------------")
        }
    }
    
    
    function create_frame(command, data) {
        var len = command.length + data.length + 1;
        var buf = new Buffer([len, [0xFF]]);
        buf = Buffer.concat([buf, new Buffer(command)]);
        buf = Buffer.concat([buf, new Buffer(data)]);
    
        var sum = 0;
        for (var i = 0; i < buf.length; i++) {
            sum = sum + buf[i]
        }
    
        sum = 256 - sum % 256;
        buf = Buffer.concat([buf, new Buffer([sum])]);
    
    //    console.log("SEND -> ", buf, buf.toString(), 'checksum',sum);
        frame_debug("SEND ->", buf);
    
        return buf;
     
    }
    
    // send data to mk2
    function communicate (buffer, cb) {
        return new Promise ((resolve, reject) => {
            mk2_emitter.emit('event', buffer, cb , resolve, reject);
        })
    }

    mk2_emitter.on('event', (buffer, cb, resolve, reject) => {
        setTimeout(() => {
            reject("mk2 timeout")
        }, 1000);
        recive = cb;                 // set common callback
        recive_resolve = resolve;
        in_buf = new Buffer("");     // clear input buffer
        try {
            port.write(buffer);          // send data
        } catch (exception) {
            console.log("mk2 can't write on serial ! ", exception)
        }
    });

    mk2_emitter.on('error', (error) => {
        console.log ("Error: ", error)
    })
    
    
    // on recive data event
    port.on('data', function (data) {
    
        in_buf = Buffer.concat([in_buf,data]);
    
        if (in_buf.byteLength >= in_buf[0]+2) {
            var frame = in_buf.slice(0,in_buf[0]+2);
            if (checksum(frame)) {
                //console.log("--->> ", frame)
                if (in_buf[0] == 0x07 && in_buf[1] == 0xFF && in_buf[2] == 0x56) {
                    // Version nummber frame recived
                } else {
                    // if checksum ok and no version frame
                    try {
                        var result = recive (frame)
                        console.log("result", result)
                        //frame_debug(result.name, frame, result)
                        recive_resolve(result)    // callback
                        recive = () => { console.log ("Clear callback pointer")} // clear common callback    
                    } catch (exception) {                        waiting_response = false;
                        console.log("mk2 recive exception", exception)
                    }
                      
                }
            }
        in_buf = in_buf.slice(in_buf[0]+2)
        }
    });
    
    function checksum (buffer) {
        var sum = 0;
        for (var i = 0; i < buffer.length; i++) {
            sum = sum + buffer[i]
        }
        check = sum % 256;
        //console.log("checksum",check)
        return check == 0 ? true : false;
    }

        
    this.start = async function() {
        return communicate (create_frame("A", "\x01\x00"), (frame) => {
            console.log("A",frame);
            return {
                name: 'start',
                content: "A"
            }
        })
    }
    
    this.led_status = async function () {
        return communicate (create_frame("L", ""), (frame) => {
            var led_status = frame[3];
            var led_blink  = frame[4];
        
            return {
                'name': 'led_status',
                'mains': ((led_status & 1) > 0 ? ((led_blink & 1) > 0 ? 'blink' : 'on') : 'off'),
                'absorption': ((led_status & 2) > 0 ? ((led_blink & 2) > 0 ? 'blink' : 'on') : 'off'),
                'bulk': ((led_status & 4) > 0 ? ((led_blink & 4) > 0 ? 'blink' : 'on') : 'off'),
                'float': ((led_status & 8) > 0 ? ((led_blink & 8) > 0 ? 'blink' : 'on') : 'off'),
                'inverter': ((led_status & 16) > 0 ? ((led_blink & 16) > 0 ? 'blink' : 'on') : 'off'),
                'overload': ((led_status & 32) > 0 ? ((led_blink & 32) > 0 ? 'blink' : 'on') : 'off'),
                'low bat': ((led_status & 64) > 0 ? ((led_blink & 64) > 0 ? 'blink' : 'on') : 'off'),
                'temp': ((led_status & 128) > 0 ? ((led_blink & 128) > 0 ? 'blink' : 'on') : 'off'),
            }
        });
    }
    
    this.umains_scale_load = async function() {
        return communicate (create_frame("W", "\x36\x00\x00"), (frame) => {
            var data    = bp.unpack('<h B h', frame, 4)
            return { 
                name: "umains_scale_load",
                umains_scale:  data[0], 
                umains_offset: data[2]
            }
        });
    }
    
    this.imains_scale_load = async function() {
        return communicate (create_frame("W", "\x36\x01\x00"), (frame) => {
            var data    = bp.unpack('<h B h', frame, 4)
            return { 
                name: "imains_scale_load",
                imains_scale:  data[0], 
                imains_offset: data[2]
            }
        });
    }
    
    this.uinv_scale_load = async function() {
        return communicate (create_frame("W", "\x36\x02\x00"), (frame) => {
            var data    = bp.unpack('<h B h', frame, 4)
            return { 
                name: "uinv_scale_load",
                uinv_scale:  data[0], 
                uinv_offset: data[2]
            }
        });
    }
    
    this.iinv_scale_load = async function() {
        return communicate (create_frame("W", "\x36\x03\x00"), (frame) => {
            var data    = bp.unpack('<h B h', frame, 4)
            return { 
                name: "iinv_scale_load",
                iinv_scale:  data[0], 
                iinv_offset: data[2]
            }
        });
    }
    
    this.ubat_scale_load = async function() {
        return communicate (create_frame("W", "\x36\x04\x00"), (frame) => {
            var data = bp.unpack('<h B h', frame, 4)
            return { 
                name: "ubat_scale_load",
                ubat_scale:  data[0], 
                ubat_offset: data[2]
            }
        });
    }
    
    this.ibat_scale_load = async function() {
        return communicate (create_frame("W", "\x36\x05\x00"), (frame) => {
            var data    = bp.unpack('<h B h', frame, 4)
            return { 
                name: "ibat_scale_load",
                ibat_scale:  data[0], 
                ibat_offset: data[2]
            }
        });
    }
    
    this.finv_scale_load = async function() {
        return communicate (create_frame("W", "\x36\x07\x00"), (frame) => {
            var data    = bp.unpack('<h B h', frame, 4)
            return { 
                name: "finv_scale_load",
                finv_scale:  data[0], 
                finv_offset: data[2]
            }
        });
    }
    
    this.fmains_scale_load = async function() {
        return communicate (create_frame("W", "\x36\x08\x00"), (frame) => {
            var data    = bp.unpack('<h B h', frame, 4)
            return { 
                name: "fmains_scale_load",
                fmains_scale: data[0], 
                fmains_offset: data[2]
            }
        });
    }
    
    
    function scale (factor) {
        s = Math.abs(factor)
        if (s >= 0x4000)
            return 1.0/(0x8000 - s)
        return s
    }
    
    
    this.dc_info = async function() {
        if (!self.ubat_calc) self.ubat_calc = await self.ubat_scale_load(); 
        if (!self.ibat_calc) self.ibat_calc = await self.ibat_scale_load(); 
        if (!self.finv_calc) self.finv_calc = await self.finv_scale_load(); 
        
        return communicate (create_frame("F", "\x00"), async (frame) => {
            var ubat = bp.unpack('<H', frame, 7);
            //if (frame[11] < 0x80) { frame  }
            ibat_buf = Buffer.concat([frame.slice(9,12),  new Buffer("\x00"), new Buffer(frame[11]>0x80 ? "\x00" : "\xFF")])
            cbat_buf = Buffer.concat([frame.slice(12,15), new Buffer("\x00"), new Buffer(frame[14]>0x80 ? "\x00" : "\xFF")])
            var ibat = bp.unpack('<i', ibat_buf);
            var cbat = bp.unpack('<i', cbat_buf);
            var finv = bp.unpack('<B', frame, 15);
            
            return {
                name: "dc_info",
                ubat: ((ubat+self.ubat_calc.ubat_offset) * scale(self.ubat_calc.ubat_scale) / 10).toFixed(2), 
                ibat: ((ibat+self.ibat_calc.ibat_offset) * scale(self.ibat_calc.ibat_scale) / 10).toFixed(2), 
                cbat: ((cbat+self.ibat_calc.ibat_offset) * scale(self.ibat_calc.ibat_scale) / 10).toFixed(2), 
                finv: (10 / ((finv+self.finv_calc.finv_offset) * scale(self.finv_calc.finv_scale))).toFixed(2)
            }
        });
    }
    
    this.ac_info = async function() {
        if (!self.umains_calc) self.umains_calc = await self.umains_scale_load(); 
        if (!self.imains_calc) self.imains_calc = await self.imains_scale_load(); 
        if (!self.uinv_calc) self.uinv_calc = await self.uinv_scale_load(); 
        if (!self.iinv_calc) self.iinv_calc = await self.iinv_scale_load(); 
        if (!self.fmains_calc) self.fmains_calc = await self.fmains_scale_load(); 

        return communicate (create_frame("F", "\x01"), (frame) => {
    
            var data = bp.unpack ("<H h H h B", frame, 7)
            var umains = data[0];
            var imains = data[1];
            var uinv   = data[2];
            var iinv   = data[3];
            var fmains = data[4] 
    
            return { 
                name:   "ac_info",
                umains: ((umains+self.umains_calc.umains_offset) * scale(self.umains_calc.umains_scale)).toFixed(1), 
                imains: ((imains+self.imains_calc.imains_offset) * scale(self.imains_calc.imains_scale)).toFixed(1), 
                uinv:   ((uinv+self.uinv_calc.uinv_offset) * scale(self.uinv_calc.uinv_scale)).toFixed(1), 
                iinv:   ((iinv+self.iinv_calc.iinv_offset) * scale(self.iinv_calc.iinv_scale)).toFixed(1), 
                fmains: (10 / ((fmains + self.fmains_calc.fmains_offset) * scale(self.fmains_calc.fmains_scale))).toFixed(1) 
            }
        });
    }
    
    this.master_multi_led_info = async function () {
        return communicate (create_frame("F", "\x05"), (frame) => {
            var data = bp.unpack('<H H H', frame, 7)
        
            return { 
                name: "master_multi_led_info",
                min_limit: data[0]/10.0, 
                max_limit: data[1]/10.0, 
                limit:     data[2]/10.0
            }
        });        
    }
    
    const states = {
        "00": 'down',
        "10": 'startup',
        "20": 'off',
        "30": 'slave',
        "40": 'invert full',
        "50": 'invert half',
        "60": 'invert aes',
        "70": 'assist',
        "80": 'bypass',
        "90": 'charge init',
        "91": 'charge bulk',
        "92": 'charge absorption',
        "93": 'charge float',
        "94": 'charge storage',
        "95": 'charge repeated absorption',
        "96": 'charge forced absorption',
        "97": 'charge equalise',
        "98": 'charge bulk stopped',
    }
    
    this.get_state = async function () {
        return communicate (create_frame("W", "\x0E\x00\x00"), (frame) => {
            var data = bp.unpack('<B B', frame, 4) 
            var state = "" + data[0] + data[1];
            return {
                name:  "get_state",
                state: states[state]
            };
        })
    }
    
    // Set the ampere level for PowerAssist.
    this.set_assist = async function (ampere) {
        var a  = ampere * 10
        var lo = a&0xFF
        var hi = a>>8
        var data = new Buffer([0x03,lo, hi, 0x01, 0x80])
        
        return communicate (create_frame("S", data), (frame) => {
            return {
                name:     "set_assist",
                setlimit: ampere
            }
        })
    }
    
    
    
    var wait = 800
    async function run () {
//        await self.start()
//        await sleep(1000)
        
//        await self.led_status();
        // await sleep(2000)
        // await self.umains_scale_load()
        // // await sleep(wait)
    
        // await self.imains_scale_load()
        // // await sleep(wait)
    
        // await self.uinv_scale_load()
        // // await sleep(wait)
    
        // await self.iinv_scale_load()
        // // await sleep(wait)
    
        // await self.ubat_scale_load()
        // // await sleep(wait)
    
        // await self.ibat_scale_load()
        // // await sleep(wait)
    
        // await self.fmains_scale_load()
        // // await sleep(wait)
    
        // await self.finv_scale_load()
        // // await sleep(wait)
    
    
        while (false) {
        //     // set_assist(16);
        //     // await sleep(wait)
    
        //     await self.master_multi_led_info()
        //     // await sleep(wait)

        try {
            //var result = await self.start()
            //console.log("result: ", result)

            //var result = await self.led_status()
            //console.log("result: ", result)
                        
            var result = await self.umains_scale_load()
            console.log("result: ", result)

        } catch (exception) {
            console.log("Exception: ", exception)
        }


            // await sleep(wait)

        //     await self.get_state()
        //     // await sleep(wait)
    
        //     await self.dc_info();
        //     // await sleep(wait)
    
        //     await self.ac_info();
        //     // await sleep(wait)
    
        //     await sleep(10000)
        }
        
    }

    return self
    
}



// test
if (true) {
    var a = new victron_mk2()
    
    setInterval(() => {
        //console.log("#####", a.data);
    }, 1000)    
}





module.exports = victron_mk2;