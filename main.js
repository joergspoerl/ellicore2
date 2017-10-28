// Main


var tristar = require("./io/tristar.js");
//var mk2 = require("./mk2.js");
//var webservice = require("./core/webservice.js");
var DbCurrentModul = require("./db/dbCurrent");
var dbCurrentInstance = new DbCurrentModul();

console.log("dbCurrent: ", dbCurrentInstance);

function writeCurrent () {
    dbCurrentInstance.dbLocal.get('current').then(
        doc => {
            doc.date = Date.now();
            doc.tristar = tristar();
            dbCurrentInstance.dbLocal.put(doc).then(
                ok => console.log("--> write: ", ok),
                error => console.log("--> write error: ", error)
            )
        }
    )
}


dbCurrentInstance.dbLocal.sync(dbCurrentInstance.dbRemote, {
    live: true,
    retry: true
}).on('change', function (change) {
    // yo, something changed!
    console.log('==> change: ', change);
    //console.log('==> change docs: ', JSON.stringify(change));
    change.change.docs.forEach(item => {
        if (item._id == 'controll') {
            console.log('controll changed !', item.request);
            writeCurrent();
        }

    })
    //writeCurrent();
}).on('paused', function (info) {
    // replication was paused, usually because of a lost connection
    console.log('==> paused: ', info);
}).on('active', function (info) {
    // replication was resumed
    console.log('==> active: ', info);
}).on('error', function (err) {
    // totally unhandled error (shouldn't happen)
    console.log('==> error: ', err);
});

console.log("wait on changes ...")

