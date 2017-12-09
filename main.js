// Main


var log = require('./logging/logging')
var tristar = require("./io/tristar.js");
//var mk2 = require("./mk2.js");
//var webservice = require("./core/webservice.js");
var DbCurrentModul = require("./db/dbCurrent");
//var dbCurrentInstance = new DbCurrentModul();

console.log("DbCurrentModul", DbCurrentModul);
//console.log("dbCurrentInstance", dbCurrentInstance);

//dbCurrentInstance.eventListener();
DbCurrentModul.hello();
DbCurrentModul.init();

//console.log("dbCurrent: ", dbCurrentInstance);


