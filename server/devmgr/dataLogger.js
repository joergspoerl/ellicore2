var log4js = require('log4js');
log4js.configure({
    appenders: {
      out: { type: 'stdout' },
      app: { type: 'dateFile', filename: 'dataLogger.log', alwaysIncludePattern: true, keepFileExt: true,  compress: true }
    },
    categories: {
      default: { appenders: [ 'out', 'app' ], level: 'debug' }
    }
  });
var dataLogger = log4js.getLogger();
dataLogger.level = 'debug';
dataLogger.debug("First Message");

var core = require("./devmgr.js");

setInterval(() => {
    dataLogger.info("BMV: ", JSON.stringify(core.devices.bmv.data));
    dataLogger.info("mppts: ", JSON.stringify(core.devices.mppt.data));
}, 2000)


module.exports = dataLogger
