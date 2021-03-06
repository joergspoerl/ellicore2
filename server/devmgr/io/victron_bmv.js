var SerialPort = require('serialport');

function victron_bmv(serialport) {

    var frame = new Buffer(0);  // in buffer
    var self  = this;           // reference to itself

    // data structure
    self.data = {};
    self.meta = {

        "V": { scale: function (v) { return v / 1000 }, unit: "V", label: "Battery voltage", descr: " this readout is useful to make a rough estimation of the battery’s state- of - charge.A 12 V battery is considered empty when it cannot maintain a voltage of 10.5 V under load conditions.Excessive voltage drops for a charged battery when under heavy load can also indicate that battery capacity is insufficient. " },
        "VS": { scale: function (v) { return v / 1000 }, unit: "V", label: "Starter battery voltage", descr: "this readout is useful to make a rough estimation of the starter battery’s state- of - charge." },
        "I": { scale: function (v) { return v / 1000 }, unit: "A", label: "Current", descr: " this represents the actual current flowing in to or out of the battery. A discharge current is indicated as a negative value (current flowing out of the battery).If for example a DC to AC inverter draws 5 A from the battery, it will be displayed as –5.0 A." },
        "CE": { scale: function (v) { return v / 1000 }, unit: "Ah", label: "Consumend Energy", descr: " this displays the amount of Ah consumed from the battery.A fully charged battery sets this readout to 0.0 Ah  (synchronised system). If a current of 12 A is drawn from the battery for a period of 3hours, this readout will show –36.0 Ah. " },
        "SOC": { scale: function (v) { return v / 10 }, unit: "%", label: "State-of-charge", descr: " this is the best way to monitor the actual state of the battery. This readout represents the current amount of energy left in the battery. A fully charged battery will be indicated by a value of 100.0%. A fully discharged battery will be indicated by a value of 0.0%" },
        "TTG": { scale: function (v) { return v / 60 }, unit: "h", label: "Time-to-go", descr: " this is an estimation of how long the battery can support the present load until it needs recharging. " },
        "Alarm": { scale: function (v) { return v }, unit: "", label: "Alarm", descr: "" },
        "Relay": { scale: function (v) { return v }, unit: "", label: "Relay", descr: "" },
        "AR": { scale: function (v) { return v }, unit: "", label: "AR", descr: "" },
        "BMV": { scale: function (v) { return v }, unit: "", label: "Device", descr: "" },
        "FW": { scale: function (v) { return v }, unit: "", label: "Version", descr: "Firmware version" },
        "H1": { scale: function (v) { return v / 1000 }, unit: "Ah", label: "deepest discharge", descr: "The depth of the deepest discharge. This is the largest value recorded for Ah consumed . " },
        "H2": { scale: function (v) { return v / 1000 }, unit: "Ah", label: "last discharge", descr: "The depth of the last discharge. This is the largest value recorded for Ah consumed since the last synchronisation. " },
        "H3": { scale: function (v) { return v / 1000 }, unit: "Ah", label: "average discharge", descr: "The depth of the average discharge. " },
        "H4": { scale: function (v) { return v / 100 }, unit: "", label: "number of cycles", descr: "The number of charge cycles. A charge cycle is counted every time the sate of charge drops below 65 %, then rises above 90 % " },
        "H5": { scale: function (v) { return v / 100 }, unit: "", label: "number of full discharges", descr: "The number of full discharges. A full discharge is counted when the state of charge reaches 0 %. " },
        "H6": { scale: function (v) { return v }, unit: "Ah", label: "The cumulative number of Amp hours drawn from the battery", descr: "" },
        "H7": { scale: function (v) { return v / 1000 }, unit: "V", label: "The minimum battery voltage.", descr: "" },
        "H8": { scale: function (v) { return v / 1000 }, unit: "V", label: "The maximum battery voltage. ", descr: "" },
        "H9": { scale: function (v) { return v / 60 / 60 / 24 }, unit: "The number of days since the last full charge. ", label: "", descr: "" },
        "H10": { scale: function (v) { return v }, unit: "", label: "The number of times the BMV has automatically synchronised. ", descr: "" },
        "H11": { scale: function (v) { return v }, unit: "", label: "The number of low voltage alarms. ", descr: "" },
        "H12": { scale: function (v) { return v }, unit: "", label: "The number of high voltage alarms. ", descr: "" },
        "H13": { scale: function (v) { return v }, unit: "", label: "The number of low starter battery voltage alarms.", descr: "" },
        "H14": { scale: function (v) { return v }, unit: "", label: "The number of high starter battery voltage alarms.", descr: "" },
        "H15": { scale: function (v) { return v / 1000 }, unit: "V", label: "The minimum starter battery voltage", descr: "" },
        "H16": { scale: function (v) { return v / 1000 }, unit: "V", label: "The maximum starter battery voltage. ", descr: "" }
    };

    function receiveBmv() {

        const parser = self.port.pipe(new SerialPort.parsers.Delimiter({ delimiter: '\r\n' }));

        // on recive data event
        parser.on('data', function (data) {

            //line = new Buffer(data).toString('ascii');
            let line = new Buffer(data)
            //console.log("DATA->" , line)
            frame = Buffer.concat([frame, line, new Buffer.from('\r\n')]);

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

                } else {
                    //console.log("frame error !!!");
                }

                // reset frame
                frame = new Buffer(0);
            }

        });



        // convert frame to javascript object
        function parseValues(frame) {

            //console.log("parseValues");
            var lines = new Buffer(frame).toString('ascii').split('\r\n');

            for (var i = 0; i < lines.length - 2; i++) {
                let line = lines[i].split('\t');
                self.data[line[0]] = self.meta[line[0]].scale(line[1]);
            }
        }
    }

    //this.port

    this.open = function (serialport) {
        // open serial port
        self.port = new SerialPort(serialport, {
            baudRate: 19200,
        }, (error) => {
            if (error) {
                console.log("BMV error:", error)
            } else {
                self.port.set({
                    "dtr": false,
                    "rts": false,
                    "cts": false,
                    "dts": false,
                    "brk": false,
                });
                console.log("bmv port is open")
                receiveBmv();
            }
        });
    }

    this.close = function () {
        self.port.close();
    }

    this.open(serialport)
}



module.exports = victron_bmv;