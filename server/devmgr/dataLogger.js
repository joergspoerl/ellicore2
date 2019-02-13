var log4js = require('log4js');
var dataLogger = log4js.getLogger();
dataLogger.level = 'debug';
dataLogger.debug("First Message");

var core = require("./devmgr.js");

setInterval(() => {
    dataLogger.debug("DATA: ", JSON.stringify(core.devices.bmv.data));
}, 2000)


module.exports = dataLogger