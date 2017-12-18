var SerialPort = require('serialport');
var bp = require('bufferpack');

// Modul Variablen

function victron_mk2 () {
    var debug_log = false;
    var in_buf = new Buffer('');  // input buffer
    var recive = function() {};   // common callback pointer
    var mk2 = { data: {}};        // data container
    
    this.data = mk2.data;
    this.close = function () {
        port.close();
    }

    // open serial port
    var port = new SerialPort('/dev/ttyUSB1', {
        baudRate: 2400,
       // parser: SerialPort.parsers.byteDelimiter([255])
    }, (error) => {
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
        },100)
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
        recive = cb;                 // set common callback
        in_buf = new Buffer("");     // clear input buffer
        try {
            port.write(buffer);          // send data
        } catch (exception) {
            console.log("mk2 can't write on serial ! ", exception)
        }
    }
    
    
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
                        recive (frame)    // callback
                        recive = () => {} // clear common callback    
                    } catch (exception) {
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
    
    
    
    
    
    
    
    
    var start = function() {
        communicate (create_frame("A", "\x01\x00"), (frame) => {
            console.log("A",frame);
        });
    }
    
    var led_status = function () {
        communicate (create_frame("L", ""), (frame) => {
            console.log("LED Frame")
            var led_status = frame[3];
            var led_blink  = frame[4];
        
            mk2.data.led = {
                'mains': ((led_status & 1) > 0 ? ((led_blink & 1) > 0 ? 'blink' : 'on') : 'off'),
                'absorption': ((led_status & 2) > 0 ? ((led_blink & 2) > 0 ? 'blink' : 'on') : 'off'),
                'bulk': ((led_status & 4) > 0 ? ((led_blink & 4) > 0 ? 'blink' : 'on') : 'off'),
                'float': ((led_status & 8) > 0 ? ((led_blink & 8) > 0 ? 'blink' : 'on') : 'off'),
                'inverter': ((led_status & 16) > 0 ? ((led_blink & 16) > 0 ? 'blink' : 'on') : 'off'),
                'overload': ((led_status & 32) > 0 ? ((led_blink & 32) > 0 ? 'blink' : 'on') : 'off'),
                'low bat': ((led_status & 64) > 0 ? ((led_blink & 64) > 0 ? 'blink' : 'on') : 'off'),
                'temp': ((led_status & 128) > 0 ? ((led_blink & 128) > 0 ? 'blink' : 'on') : 'off'),
            }
            console.log (mk2.data.led);
        
        });
    }
    
    var umains_scale
    var umains_offset
    var umains_scale_load = function() {
        communicate (create_frame("W", "\x36\x00\x00"), (frame) => {
            var data    = bp.unpack('<h B h', frame, 4)
            umains_scale  = data[0];
            umains_offset = data[2];
            frame_debug("umains_scale_load:", frame, { umains_scale: umains_scale, umains_offset: umains_offset})
        });
    }
    
    var imains_scale
    var imains_offset
    var imains_scale_load = function() {
        communicate (create_frame("W", "\x36\x01\x00"), (frame) => {
            var data    = bp.unpack('<h B h', frame, 4)
            imains_scale  = data[0];
            imains_offset = data[2];
            frame_debug("imains_scale_load:", frame, { imains_scale: imains_scale, imains_offset: imains_offset})
        });
    }
    
    var uinv_scale
    var uinv_offset
    var uinv_scale_load = function() {
        communicate (create_frame("W", "\x36\x02\x00"), (frame) => {
            var data    = bp.unpack('<h B h', frame, 4)
            uinv_scale  = data[0];
            uinv_offset = data[2];
            frame_debug("uinv_scale_load:", frame, { uinv_scale: uinv_scale, uinv_offset: uinv_offset})
        });
    }
    
    var iinv_scale
    var iinv_offset
    var iinv_scale_load = function() {
        communicate (create_frame("W", "\x36\x03\x00"), (frame) => {
            var data    = bp.unpack('<h B h', frame, 4)
            iinv_scale  = data[0];
            iinv_offset = data[2];
            frame_debug("iinv_scale_load:", frame, { iinv_scale: iinv_scale, iinv_offset: iinv_offset})
        });
    }
    
    var ubat_scale
    var ubat_offset
    var ubat_scale_load = function() {
        communicate (create_frame("W", "\x36\x04\x00"), (frame) => {
            var data = bp.unpack('<h B h', frame, 4)
            ubat_scale = data[0];
            ubat_offset = data[2];
            frame_debug("ubat_scale_load:", frame, { ubat_scale: ubat_scale, ubat_offset: ubat_offset})
        });
    }
    
    var ibat_scale
    var ibat_offset
    var ibat_scale_load = function() {
        communicate (create_frame("W", "\x36\x05\x00"), (frame) => {
            var data    = bp.unpack('<h B h', frame, 4)
            ibat_scale  = data[0];
            ibat_offset = data[2];
            frame_debug("ibat_scale_load:", frame, { ibat_scale: ibat_scale, ibat_offset: ibat_offset})
        });
    }
    
    var finv_scale
    var finv_offset
    var finv_scale_load = function() {
        communicate (create_frame("W", "\x36\x07\x00"), (frame) => {
            var data    = bp.unpack('<h B h', frame, 4)
            finv_scale  = data[0];
            finv_offset = data[2];
            frame_debug("finv_scale_load:", frame, { finv_scale: finv_scale, finv_offset: finv_offset})
        });
    }
    
    var fmains_scale
    var fmains_offset
    var fmains_scale_load = function() {
        communicate (create_frame("W", "\x36\x08\x00"), (frame) => {
            var data    = bp.unpack('<h B h', frame, 4)
            fmains_scale  = data[0];
            fmains_offset = data[2];
            frame_debug("fmains_scale_load:", frame, { fmains_scale: fmains_scale, fmains_offset: fmains_offset})
        });
    }
    
    
    function scale (factor) {
        s = Math.abs(factor)
        if (s >= 0x4000)
            return 1.0/(0x8000 - s)
        return s
    }
    
    
    var dc_info = function() {
        communicate (create_frame("F", "\x00"), (frame) => {
            var ubat = bp.unpack('<H', frame, 7);
            //if (frame[11] < 0x80) { frame  }
            ibat_buf = Buffer.concat([frame.slice(9,12),  new Buffer("\x00"), new Buffer(frame[11]>0x80 ? "\x00" : "\xFF")])
            cbat_buf = Buffer.concat([frame.slice(12,15), new Buffer("\x00"), new Buffer(frame[14]>0x80 ? "\x00" : "\xFF")])
            var ibat = bp.unpack('<i', ibat_buf);
            var cbat = bp.unpack('<i', cbat_buf);
            var finv = bp.unpack('<B', frame, 15);
            console.log("finv", finv, bp.unpack('B', frame, 15), frame[15])
    
            mk2.data.ubat = (ubat+ubat_offset) * scale(ubat_scale);
            mk2.data.ibat = (ibat+ibat_offset) * scale(ibat_scale);
            mk2.data.cbat = (cbat+ibat_offset) * scale(ibat_scale);
            mk2.data.finv = 10 / ((finv+finv_offset) * scale(finv_scale)); 
            
            frame_debug("dc_info:", frame, {ubat: mk2.data.ubat, ibat: mk2.data.ibat, cbat: mk2.data.cbat, finv:mk2.data.finv })
        });
    }
    
    var ac_info = function() {
        communicate (create_frame("F", "\x01"), (frame) => {
    
            var data = bp.unpack ("<H h H h B", frame, 7)
            //console.log("data", data)
            var umains = data[0];
            var imains = data[1];
            var uinv   = data[2];
            var iinv   = data[3];
            var fmains = data[4] 
    
            mk2.data.umains = (umains+umains_offset) * scale(umains_scale);
            mk2.data.imains = (imains+imains_offset) * scale(imains_scale);
            mk2.data.uinv   = (uinv+uinv_offset) * scale(uinv_scale);
            mk2.data.iinv   = (iinv+iinv_offset) * scale(iinv_scale);
            mk2.data.fmains = 10 / ((fmains + fmains_offset) * scale(fmains_scale)); 
            
            frame_debug("ac_info", frame, { umains: mk2.data.umains, imains:mk2.data.imains, uinv: mk2.data.uinv, iinv:mk2.data.iinv, fmains:mk2.data.fmains })
        });
    }
    
    var master_multi_led_info = function () {
        communicate (create_frame("F", "\x05"), (frame) => {
            var data = bp.unpack('<H H H', frame, 7)
    
            var min_limit = data[0];
            var max_limit = data[1];
            var limit     = data[2];
    
            mk2.data.min_limit = min_limit/10.0;
            mk2.data.max_limit = max_limit/10.0;
            mk2.data.limit     = limit/10.0;
    
            frame_debug("master_multi_led_info", frame, { min_limit: mk2.data.min_limit, max_limit:mk2.data.max_limit, limit:mk2.data.limit})
        });        
    }
    
    var states = {
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
    
    var get_state = function () {
        communicate (create_frame("W", "\x0E\x00\x00"), (frame) => {
            var data = bp.unpack('<B B', frame, 4) 
            var state = "" + data[0] + data[1];
            console.log("state", state, "data", data)
            mk2.data.state = states[state];
            frame_debug("get_state", frame, {state: mk2.data.state});
        })
    }
    
    // Set the ampere level for PowerAssist.
    var set_assist = function (ampere) {
        var a  = ampere * 10
        var lo = a&0xFF
        var hi = a>>8
        var data = new Buffer([0x03,lo, hi, 0x01, 0x80])
        
        communicate (create_frame("S", data), (frame) => {
            frame_debug("set_assist", frame);
        })
    }
    this.set_assist = set_assist;
    
    
    var wait = 800
    async function run () {
        start()
        await sleep(1000)
    
        // led_status();
        // await sleep(2000)
        umains_scale_load()
        await sleep(wait)
    
        imains_scale_load()
        await sleep(wait)
    
        uinv_scale_load()
        await sleep(wait)
    
        iinv_scale_load()
        await sleep(wait)
    
        ubat_scale_load()
        await sleep(wait)
    
        ibat_scale_load()
        await sleep(wait)
    
        fmains_scale_load()
        await sleep(wait)
    
        finv_scale_load()
        await sleep(wait)
    
    
        while (true) {
            // set_assist(16);
            // await sleep(wait)
    
            master_multi_led_info()
            await sleep(wait)

            led_status()
            await sleep(wait)

            get_state()
            await sleep(wait)
    
            dc_info();
            await sleep(wait)
    
            ac_info();
            await sleep(wait)
    
            await sleep(10000)
        }
        
    }

    return this
    
}

// test
if (false) {
    var a = new victron_mk2()
    
    setInterval(() => {
        console.log("#####", a.data);
    }, 1000)    
}



module.exports = victron_mk2;