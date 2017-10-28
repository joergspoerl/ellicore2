function dbCurrent() {
    var PouchDB = require('pouchdb');
    const dbCredentials = require('./dbCredentials.json');

    this.dbLocal = new PouchDB(dbCredentials.name);
    this.dbRemote = new PouchDB('https://'
        + dbCredentials.usr + ':' + dbCredentials.pwd + '@'
        + dbCredentials.url + dbCredentials.name);

    this.dbLocal.info().then(
        ok => console.log(ok)
    );
    this.dbRemote.info().then(
        ok => console.log(ok)
    );

    
}



module.exports = dbCurrent;
