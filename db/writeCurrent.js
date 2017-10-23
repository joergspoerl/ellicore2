var PouchDB = require('pouchdb');

// {
//     "name":  "ellicore-current",
//     "url":   "jrg.deneb.uberspace.de/couchdb/",
//     "usr":   "ellicore",
//     "pwd":   ""
// }
const dbCredentials = require ('./dbCredentials.json');


var dbLocal  = new PouchDB(dbCredentials.name);
var dbRemote = new PouchDB('https://' 
    + dbCredentials.usr + ':' + dbCredentials.pwd + '@' 
    + dbCredentials.url + dbCredentials.name );



dbLocal.info().then(
    ok => console.log(ok)
);
dbRemote.info().then(
    ok => console.log(ok)
);
