
var victron_bmv = require("../io/victron_bmv");
var bmv = new victron_bmv("/dev/ttyUSB0")

var victron_mk2 = require("../io/victron_mk2.v2");
var mk2 = new victron_mk2("/dev/ttyUSB1")

var devices = [bmv, mk2];

module.exports = {
    devices: devices
} 
