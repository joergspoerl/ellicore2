var log = require('../logging/logging')

module.exports.hello = hello;
module.exports.init = init;
module.exports.writeCurrent = writeCurrent;
module.exports.compact = compact;


var dbLocal;
var dbRemote;
var dbSyncHandler;

function hello() {
    console.log("Hello");
}



function init() {
    var PouchDB = require('pouchdb');
    const dbCredentials = require('./dbCredentials.json');
    const pouchOptions = {
        auto_compaction: true,
        //revs_limit: 1
    }

    dbLocal = new PouchDB(dbCredentials.name, pouchOptions);
    dbRemote = new PouchDB('https://'
        + dbCredentials.usr + ':' + dbCredentials.pwd + '@'
        + dbCredentials.url + dbCredentials.name, pouchOptions);

    dbLocal.info().then(
        ok => {

            log("***************************************************")
            log(ok)
            log("***************************************************")

        }
    )

    dbRemote.info().then(
        ok => {
            log("***************************************************")
            log(ok)
            log("***************************************************")
        }
    )
}


function writeCurrent(newValue) {
    this.db.get("current").then(
        current => {
            newValue._id = current._id;
            newValue._rev = current._rev;
            this.db.put(current).then(
                ok => {
                    log("current value saved !")
                }
            )
        },
        error => {
            if (error.status == 404) {
                newValue._id = 'current';

                this.db.put(newValue).then(
                    ok => {
                        log("current value created !")
                    })
            }
            log("ERROR: ", error);
        }
    )

}



function eventListener() {
    dbSyncHandler = dbLocal.sync(dbRemote, {
        live: true,
        retry: true
    }).on('change', function (change) {
        // yo, something changed!
        log('==> change: ', change);
        //console.log('==> change docs: ', JSON.stringify(change));
        change.change.docs.some(item => {
            if (item._id == 'controll') {
                log('controll changed !', item.request);
                writeCurrent();
                return true; // break
            }

        })
        //writeCurrent();
    }).on('paused', function (info) {
        // replication was paused, usually because of a lost connection
        log('==> paused: ', info);
    }).on('active', function (info) {
        // replication was resumed
        log('==> active: ', info);
    }).on('error', function (err) {
        // totally unhandled error (shouldn't happen)
        log('==> error: ', err);
    });
}




function compact() {
    dbLocal.compact().then(
        ok => log("--> dbLocal compact !"),
        er => log("--> dbLocal compact ERROR !", er)
    );
    dbRemote.compact().then(
        ok => log("--> dbRemote compact !"),
        er => log("--> dbRemote compact ERROR !", er)
    );;

}







