function dbCurrent() {
    var PouchDB = require('pouchdb');
    const dbCredentials = require('./dbCredentials.json');
    const pouchOptions = {
        auto_compaction: true,
        //revs_limit: 1
    }

    this.dbLocal = new PouchDB(dbCredentials.name, pouchOptions);
    this.dbRemote = new PouchDB('https://'
        + dbCredentials.usr + ':' + dbCredentials.pwd + '@'
        + dbCredentials.url + dbCredentials.name, pouchOptions);

    this.dbLocal.info().then(
        ok => {

            console.log("***************************************************")
            console.log(ok)
            console.log("***************************************************")

        }
    )
    


    this.dbRemote.info().then(
        ok => {
            console.log("***************************************************")
            console.log(ok)
            console.log("***************************************************")
        }
    )

}



module.exports = dbCurrent;
