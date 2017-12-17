var SerialPort = require('serialport');
var Victron_mk2 = require('../../io/victron_mk2')

// Modul Variablen
var BMV_values = {

    "V": { scale: function (v) { return v / 1000 }, value: 0, unit: "V", label: "Battery voltage", descr: " this readout is useful to make a rough estimation of the battery’s state- of - charge.A 12 V battery is considered empty when it cannot maintain a voltage of 10.5 V under load conditions.Excessive voltage drops for a charged battery when under heavy load can also indicate that battery capacity is insufficient. " },
    "VS": { scale: function (v) { return v / 1000 }, value: 0, unit: "V", label: "Starter battery voltage", descr: "this readout is useful to make a rough estimation of the starter battery’s state- of - charge."},
    "I": { scale: function (v) { return v / 1000 }, value: 0, unit: "A", label: "Current", descr: " this represents the actual current flowing in to or out of the battery. A discharge current is indicated as a negative value (current flowing out of the battery).If for example a DC to AC inverter draws 5 A from the battery, it will be displayed as –5.0 A."},
    "CE": { scale: function (v) { return v / 1000}, value: 0, unit: "Ah", label: "Consumend Energy", descr: " this displays the amount of Ah consumed from the battery.A fully charged battery sets this readout to 0.0 Ah  (synchronised system). If a current of 12 A is drawn from the battery for a period of 3hours, this readout will show –36.0 Ah. "},
    "SOC": { scale: function (v) { return v / 10 }, value: 0, unit: "%", label: "State-of-charge", descr: " this is the best way to monitor the actual state of the battery. This readout represents the current amount of energy left in the battery. A fully charged battery will be indicated by a value of 100.0%. A fully discharged battery will be indicated by a value of 0.0%"},
    "TTG": { scale: function (v) { return v / 60 }, value: 0, unit: "h", label: "Time-to-go", descr: " this is an estimation of how long the battery can support the present load until it needs recharging. "},
    "Alarm": { scale: function (v) { return v }, value: 0, unit: "", label: "Alarm", descr: ""},
    "Relay": { scale: function (v) { return v }, value: 0, unit: "", label: "Relay", descr: ""},
    "AR": { scale: function (v) { return v }, value: 0, unit: "", label: "AR", descr: ""},
    "BMV": { scale: function (v) { return v }, value: 0, unit: "", label: "Device", descr: ""},
    "FW": { scale: function (v) { return v }, value: 0, unit: "", label: "Version", descr: "Firmware version"},
    "H1": { scale: function (v) { return v / 1000 }, value: 0, unit: "Ah", label: "deepest discharge", descr: "The depth of the deepest discharge. This is the largest value recorded for Ah consumed . "},
    "H2": { scale: function (v) { return v / 1000 }, value: 0, unit: "Ah", label: "last discharge", descr: "The depth of the last discharge. This is the largest value recorded for Ah consumed since the last synchronisation. "},
    "H3": { scale: function (v) { return v / 1000 }, value: 0, unit: "Ah", label: "average discharge", descr: "The depth of the average discharge. "},
    "H4": { scale: function (v) { return v / 100 }, value: 0, unit: "", label: "number of cycles", descr: "The number of charge cycles. A charge cycle is counted every time the sate of charge drops below 65 %, then rises above 90 % "},
    "H5": { scale: function (v) { return v / 100 }, value: 0, unit: "", label: "number of full discharges", descr: "The number of full discharges. A full discharge is counted when the state of charge reaches 0 %. "},
    "H6": { scale: function (v) { return v }, value: 0, unit: "Ah", label: "The cumulative number of Amp hours drawn from the battery", descr: ""},
    "H7": { scale: function (v) { return v / 1000 }, value: 0, unit: "V", label: "The minimum battery voltage.", descr: ""},
    "H8": { scale: function (v) { return v / 1000 }, value: 0, unit: "V", label: "The maximum battery voltage. ", descr: ""},
    "H9": { scale: function (v) { return v / 60 / 60 / 24 }, value: 0, unit: "The number of days since the last full charge. ", label: "", descr: ""},
    "H10": { scale: function (v) { return v }, value: 0, unit: "", label: "The number of times the BMV has automatically synchronised. ", descr: ""},
    "H11": { scale: function (v) { return v }, value: 0, unit: "", label: "The number of low voltage alarms. ", descr: ""},
    "H12": { scale: function (v) { return v }, value: 0, unit: "", label: "The number of high voltage alarms. ", descr: ""},
    "H13": { scale: function (v) { return v }, value: 0, unit: "", label: "The number of low starter battery voltage alarms.", descr: ""},
    "H14": { scale: function (v) { return v }, value: 0, unit: "", label: "The number of high starter battery voltage alarms.", descr: ""},
    "H15": { scale: function (v) { return v / 1000 }, value: 0, unit: "V", label: "The minimum starter battery voltage", descr: ""},
    "H16": { scale: function (v) { return v / 1000 }, value: 0, unit: "V", label: "The maximum starter battery voltage. ", descr: ""}

};
var frame = new Buffer(0);

function receiveBmv (port, cb) {

    const parser = port.pipe(new SerialPort.parsers.Delimiter({ delimiter: '\r\n' }));

    // on recive data event
    parser.on('data', function (data) {

        //line = new Buffer(data).toString('ascii');
        let line = new Buffer(data)
        //console.log("DATA->" , line)
        frame = Buffer.concat([frame, line,new Buffer.from('\r\n')]);

        // Detect end of frame
        if (line.toString().startsWith("Checksum")) {

            //console.log("detect end of frame")
            // Modulo256
            var sum = 0;
            for (var i = 0; i < frame.length; i++) {
                sum = (sum + frame[i]) % 256;
            }

            if (sum == 0) {
                // frame is ok
                parseValues(frame);
                cb ( BMV_values );

            } else {
                //console.log("frame error !!!");
            }

            // reset frame
            frame = new Buffer(0);
        }

    });



    // convert frame to javascript object
    function parseValues (frame) {
        
        //console.log("parseValues");
            var lines = new Buffer(frame).toString('ascii').split('\r\n');
        
            for (var i = 0; i < lines.length - 2; i++) {
                let line = lines[i].split('\t');
                BMV_values[line[0]].value = BMV_values[line[0]].scale(line[1]);
            }
        
    }
    

}


module.exports = function(RED) {
    function BmvNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var globalContext = this.context().global;
        
        // open serial port
        var port = new SerialPort(config.serialport, {
            baudRate: 19200,
        }, (error) => {
            if (error) {
                console.log("BMV error:", error)
            } else {
                port.set({
                    "dtr": false,
                    "rts": false,
                    "cts": false,
                    "dts": false,
                    "brk": false,
                });
            }
        });

        node.on('input', function(msg) {
            msg.payload = "BMV DATA --->";
            node.send(msg);
        });

        node.on('close', function() {
            console.log("BMV close:");
            port.close();
        });


        receiveBmv(port, (data) => {
            node.send ({ payload: data })
            globalContext.set("bmv-node", data);  // this is now available to other nodes
        });

    }
    RED.nodes.registerType("bmv-node",BmvNode);


/***************************************************************************** */

    function BmvNodeValue(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var globalContext = this.context().global;
        

        node.on('input', function(msg) {
            msg.payload = globalContext.get("bmv-node")[config.bmvValue].value;
            msg.unit = globalContext.get("bmv-node")[config.bmvValue].unit;
            msg.label = globalContext.get("bmv-node")[config.bmvValue].label;
            node.send(msg);
        });

        node.on('close', function() {
        });

    }
    RED.nodes.registerType("bmv-node-value",BmvNodeValue);


    /***************************************************************************** */

    function mk2(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var globalContext = this.context().global;

        var mk2 = globalContext.get("mk2-node")
        if (!mk2) {
            mk2 = new Victron_mk2();
        }

        node.on('input', function(msg) {
            console.log("mk2-node input", msg)
            if (msg.payload && msg.payload.set_assist) {
                mk2.set_assist(msg.payload.set_assist)
            }
            msg.payload = mk2.data;
            node.send(msg);
        });

        node.on('close', function() {
            mk2.close();
        });

    }
    RED.nodes.registerType("mk2-node",mk2);

}




//receiveBmv("/dev/ttyUSB0", (data) => console.log ("data: ", data));
