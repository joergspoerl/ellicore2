console.log("Use core module")

var victron_bmv = require("../io/victron_bmv");
var bmv = new victron_bmv("/dev/ttyUSB0")

var victron_mk2 = require("../io/victron_mk2");
var mk2 = new victron_mk2("/dev/ttyUSB1")

var tristar_mppt = require("../io/tristar_mppt");
var mppt = new tristar_mppt("192.168.20.242");

const raspi   = require('raspi');
const I2C     = require('raspi-i2c').I2C;
const saa1064 = require("../io/saa1064");

var manager = {
    devices: {
        bmv: bmv,
        mk2: mk2,
        mppt: mppt,
        disp1: {},
        disp2: {},
        disp3: {},
        disp4: {},
    }
}

raspi.init(() => {
    const i2c = new I2C();
    manager.devices.disp1 = new saa1064(i2c, 56);
    manager.devices.disp2 = new saa1064(i2c, 58);
    //var led7seg3 = new saa1064(60);
    //var led7seg4 = new saa1064(62);

})


module.exports = manager




