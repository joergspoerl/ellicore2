var SerialPort = require('serialport');
var bufferpack = require('bufferpack');


// Modul Variablen

var frameBuffer = new Buffer('');
var mk2 = { data: {}};

currentCallback = function () { };





// open serial port
var port = new SerialPort('COM5', {
    baudRate: 2400,
    parser: SerialPort.parsers.byteDelimiter([255])
});

// wait for open port
// set controll bits, then BMW-cabelconverter is working
setTimeout(function () {
    console.log("mk2-dtr: on");
    port.set({
        "dtr": true,
        "rts": false,
        "cts": false,
        "dts": false,
        "brk": false,
    })


}, 1000); // Timer

var currentCallback ;

var req = function (Commando, Extention, callback) {
    currentCallback = callback;
    port.write(createCommandFrame(Commando, Extention));
};

mk2.cmd = {};
mk2.cmd.start = function (callback) {
    req('A', '\x01\x00', function (data) {
        console.log("Start->", data);
    });
    if (typeof callback === "function") {
        callback();
    }     
};


mk2.cmd.inverter_voltage = function (callback) {
    req('W\x36\x02\x00', '', function (data) {

        console.log("Inverter->", data);

        unpack_data = bufferpack.unpack('<h B h', data, 2);
        console.log(unpack_data);

    });
    if (typeof callback === "function") {
        callback();
    }     
};


mk2.cmd.led = function (callback) {
    req('L', '', function (data) {
        console.log("Led->", data);

        led_status = data[1];
        led_blink = data[2];

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

        //console.log(mk2.data.led);

    });
    if (typeof callback === "function") {
        callback();
    }     
};


mk2.cmd.SoftwareVersionLO = function () {
    req('W', '\x05\x00\x00', function (data) {
        console.log("Inverter->", data);
    });
};


mk2.cmd.SoftwareVersionHIGH = function () {
    req('W', '\x06\x00\x00', function (data) {
        console.log("Inverter->", data);
    });
};

setInterval(function () {


    mk2.cmd.start(function () {
        mk2.cmd.led(function () {
            mk2.cmd.inverter_voltage();
        });
    });


}, 3000);








mk2.command = {



    SoftwareVersion: {
        request: function () {
            port.write(createCommandFrame('W', '\x05\x00\x00'));
        },

        response: function (frame) {
            if (frame[0] == 'W'.charCodeAt(0)
             && frame[1] == '\x82'.charCodeAt(0)) {
                console.log("SoftwareVersion-response  LO: ", frame[2], frame[3], frame[4], frame[5]);
                port.write(createCommandFrame('W', '\x06\x00\x00'));

            }
            if (frame[0] == 'W'.charCodeAt(0)
                && frame[1] == '\x83'.charCodeAt(0)) {
                console.log("SoftwareVersion-response   HIGH: ", frame[2], frame[3], frame[4], frame[5]);
            }

        }

    },





    inverter_voltage: {
        request: function () {
            port.write(createCommandFrame('W\x36\x02\x00', ''));
        },

        response: function (frame) {
            if (frame[0] == 'W'.charCodeAt(0)
                && frame[0] == '\x00'.charCodeAt(0)) {
                console.log("inverter_voltage-response: ", frame);
                console.log("inverter_voltage-response: ", frame.values());

                //iinv_scale, ignore, iinv_offset = unpack('<h B h', data[3:8])
                //return (iinv_scale, iinv_offset)

                data = bufferpack.unpack('<h B h', frame, 2);
                console.log(data);


            }
        }

    },

};







function createCommandFrame(command, data) {
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

    console.log("SEND -> ", buf, buf.toString(), 'checksum',sum);

    return buf;
 
}


// on recive data event
port.on('data', function (data) {

    var recive = new Buffer(data);

    console.log("recive", recive, data);

    if (data[0] != 'V'.charCodeAt(0)) {
        //console.log("recive",recive);

        currentCallback(data);
        currentCallback = function () { };

    };

});






module.exports = function () { return mk2 };