import { IBmv } from "../types/EllicoreTypes";

const EventEmitter = require('events');
var SerialPort = require('serialport');


// Modul Variablen
var BMV_values = {

    "V": { scale: function (v:number) { return v / 1000 }, value: 0, unit: "V", label: "Battery voltage", descr: " this readout is useful to make a rough estimation of the battery’s state- of - charge.A 12 V battery is considered empty when it cannot maintain a voltage of 10.5 V under load conditions.Excessive voltage drops for a charged battery when under heavy load can also indicate that battery capacity is insufficient. " },
    "VS": { scale: function (v:number) { return v / 1000 }, value: 0, unit: "V", label: "Starter battery voltage", descr: "this readout is useful to make a rough estimation of the starter battery’s state- of - charge."},
    "I": { scale: function (v:number) { return v / 1000 }, value: 0, unit: "A", label: "Current", descr: " this represents the actual current flowing in to or out of the battery. A discharge current is indicated as a negative value (current flowing out of the battery).If for example a DC to AC inverter draws 5 A from the battery, it will be displayed as –5.0 A."},
    "CE": { scale: function (v:number) { return v / 1000}, value: 0, unit: "Ah", label: "Consumend Energy", descr: " this displays the amount of Ah consumed from the battery.A fully charged battery sets this readout to 0.0 Ah  (synchronised system). If a current of 12 A is drawn from the battery for a period of 3hours, this readout will show –36.0 Ah. "},
    "SOC": { scale: function (v:number) { return v / 10 }, value: 0, unit: "%", label: "State-of-charge", descr: " this is the best way to monitor the actual state of the battery. This readout represents the current amount of energy left in the battery. A fully charged battery will be indicated by a value of 100.0%. A fully discharged battery will be indicated by a value of 0.0%"},
    "TTG": { scale: function (v:number) { return v / 60 }, value: 0, unit: "h", label: "Time-to-go", descr: " this is an estimation of how long the battery can support the present load until it needs recharging. "},
    "Alarm": { scale: function (v:number) { return v }, value: 0, unit: "", label: "Alarm", descr: ""},
    "Relay": { scale: function (v:number) { return v }, value: 0, unit: "", label: "Relay", descr: ""},
    "AR": { scale: function (v:number) { return v }, value: 0, unit: "", label: "", descr: ""},
    "BMV": { scale: function (v:number) { return v }, value: 0, unit: "", label: "Device", descr: ""},
    "FW": { scale: function (v:number) { return v }, value: 0, unit: "", label: "Version", descr: "Firmware version"},
    "H1": { scale: function (v:number) { return v / 1000 }, value: 0, unit: "Ah", label: "deepest discharge", descr: "The depth of the deepest discharge. This is the largest value recorded for Ah consumed . "},
    "H2": { scale: function (v:number) { return v / 1000 }, value: 0, unit: "Ah", label: "last discharge", descr: "The depth of the last discharge. This is the largest value recorded for Ah consumed since the last synchronisation. "},
    "H3": { scale: function (v:number) { return v / 1000 }, value: 0, unit: "Ah", label: "average discharge", descr: "The depth of the average discharge. "},
    "H4": { scale: function (v:number) { return v / 100 }, value: 0, unit: "", label: "number of cycles", descr: "The number of charge cycles. A charge cycle is counted every time the sate of charge drops below 65 %, then rises above 90 % "},
    "H5": { scale: function (v:number) { return v / 100 }, value: 0, unit: "", label: "number of full discharges", descr: "The number of full discharges. A full discharge is counted when the state of charge reaches 0 %. "},
    "H6": { scale: function (v:number) { return v }, value: 0, unit: "Ah", label: "", descr: "The cumulative number of Amp hours drawn from the battery"},
    "H7": { scale: function (v:number) { return v / 1000 }, value: 0, unit: "V", label: "", descr: "The minimum battery voltage."},
    "H8": { scale: function (v:number) { return v / 1000 }, value: 0, unit: "V", label: "", descr: "The maximum battery voltage. "},
    "H9": { scale: function (v:number) { return v / 60 / 60 / 24 }, value: 0, unit: "", label: "", descr: "The number of days since the last full charge. "},
    "H10": { scale: function (v:number) { return v }, value: 0, unit: "", label: "", descr: "The number of times the BMV has automatically synchronised. "},
    "H11": { scale: function (v:number) { return v }, value: 0, unit: "", label: "", descr: "The number of low voltage alarms. "},
    "H12": { scale: function (v:number) { return v }, value: 0, unit: "", label: "", descr: "The number of high voltage alarms. "},
    "H13": { scale: function (v:number) { return v }, value: 0, unit: "", label: "", descr: "The number of low starter battery voltage alarms."},
    "H14": { scale: function (v:number) { return v }, value: 0, unit: "", label: "", descr: "The number of high starter battery voltage alarms."},
    "H15": { scale: function (v:number) { return v / 1000 }, value: 0, unit: "V", label: "", descr: "The minimum starter battery voltage"},
    "H16": { scale: function (v:number) { return v / 1000 }, value: 0, unit: "V", label: "", descr: "The maximum starter battery voltage. "}

};
var frame = new Buffer(0);


// open serial port
var port = new SerialPort('COM4', {
    baudRate: 19200,
    parser: SerialPort.parsers.byteDelimiter([13, 10])
});

// wait for open port
// set controll bits, then BMW-cabelconverter is working
setTimeout(function () {

    var levelConverterOn = function () {
        port.set({
            "dtr": false,
            "rts": false,
            "cts": false,
            "dts": false,
            "brk": false,
        });
    };
    levelConverterOn();


}, 1000); // Timer




// on recive data event
port.on('data', function (data:any) {

    //line = new Buffer(data).toString('ascii');
    let line = new Buffer(data)
    frame = Buffer.concat([frame, line]);

    // Detect end of frame
    if (line.toString().startsWith("Checksum")) {
        // Modulo256
        var sum = 0;
        for (var i = 0; i < frame.length; i++) {
            sum = (sum + frame[i]) % 256;
        }

        if (sum == 0) {
            // frame is ok
            parseValues(frame);

        } else {
            //console.log("frame error !!!");
        }

        // reset frame
        frame = new Buffer(0);
    }

});



// convert frame to javascript object
function parseValues (frame) {

    var lines = new Buffer(frame).toString('ascii').split('\r\n');

    for (var i = 0; i < lines.length - 2; i++) {
        let line = lines[i].split('\t');
        BMV_values[line[0]].value = BMV_values[line[0]].scale(line[1]);
    }

}

module.exports = function () 
{
    var output: IBmv = 
    {
        SOC: BMV_values.SOC.value,
        I:   BMV_values.I.value,
        V:   BMV_values.V.value
    } 
    return output; 
};