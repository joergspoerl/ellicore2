//Found at : http://stackoverflow.com/questions/23684802/node-js-serialport-synchronous-write-read
var SerialPort = require('serialport');

function Device (serial) {
    this._serial = serial;
    this._queue = [];
    this._busy = false;
    this._current = null;
    var device = this;
    serial.on('data', function (data) {
        if (!device._current) return;
        device._current[1](data);
        device.processQueue();
    });
}

Device.prototype.send = function (data, callback) {
    this._queue.push([data, callback]);
    if (this._busy) return;
    this._busy = true;
    this.processQueue();
};

Device.prototype.processQueue = function () {
    var next = this._queue.shift();

    if (!next) {
        this._busy = false;
        return;
    }

    this._current = next;
    this._serial.write(next[0]);
};


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
            //self.start();
        },500)
    } else {
        // ERROR
        console.log ("mk2 open port error: ", error)
    }
});


function run () {
    var dev = new Device(port)
    var test_data = new Buffer.from("<Buffer 08 ff 4c 09 00 00 00 03 00 a1>");
    dev.send (test_data, (data, data1) => {
        console.log("data: ", data, data1)
    });
}

