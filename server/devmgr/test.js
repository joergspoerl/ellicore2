console.log("Use 'core' module")


var victron_mk2 = require("./io/victron_mk2");
var mk2 = new victron_mk2("/dev/ttyUSB0")


setTimeout( () => {
    mk2.set_assist(16);
}, 10000)


