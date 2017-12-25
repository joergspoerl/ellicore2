console.log("Use core module")

var victron_bmv = require("../io/victron_bmv");
var bmv = new victron_bmv("/dev/ttyUSB0")

var victron_mk2 = require("../io/victron_mk2");
var mk2 = new victron_mk2("/dev/ttyUSB1")

var tristar_mppt = require("../io/tristar_mppt");
var mppt = new tristar_mppt("192.168.20.242")

module.exports = {
    devices: {
        bmv: bmv,
        mk2: mk2,
        mppt: mppt,
        "7seg": {
            1: {data: "TEST1"},
            2: {data: "TEST2"},
            3: {data: "TEST3"},
            4: {data: "TEST4"},
        }
    }
} 
