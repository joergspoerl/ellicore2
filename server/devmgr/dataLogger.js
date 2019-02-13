var log4js = require('log4js');
log4js.configure({
    appenders: {
      out: { type: 'stdout' },
      app: { type: 'file', filename: 'dataLogger.log', maxLogSize: 10485760, backups: 100, compress: true  }
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
    dataLogger.info("DATA: ", JSON.stringify(core.devices.bmv.data));
}, 2000)


module.exports = dataLogger