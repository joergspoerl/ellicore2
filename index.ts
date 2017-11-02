/*

    Hello World Node App

*/
import { DbCurrent } from './db/db'
var tristar = require ('./io/tristar.js') 

let dbCurrent = new DbCurrent();

dbCurrent.getInfo();

console.log ("Hello World");
dbCurrent.startTimer(tristar);