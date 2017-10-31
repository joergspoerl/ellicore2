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
            putCurrent(doc);
        },

        error => {
            if (error.status == 404) {
                putCurrent({_id:'current'});                
            }
        }
    )

    function putCurrent (doc) {
        doc.date = Date.now();
        doc.tristar = tristar();
        dbCurrentInstance.dbLocal.put(doc).then(
            ok => {
                console.log("--> write: ", ok)
                //compact();
            },
            error => {
                console.log("--> write error: ", error)
            }
        )
    }

    function compact() {
        dbCurrentInstance.dbLocal.compact().then(
            ok => console.log("--> dbLocal compact !"),
            er => console.log("--> dbLocal compact ERROR !", er)
        );
        dbCurrentInstance.dbRemote.compact().then(
            ok => console.log("--> dbRemote compact !"),
            er => console.log("--> dbRemote compact ERROR !", er)
        );;

    }
}


dbCurrentInstance.dbLocal.sync(dbCurrentInstance.dbRemote, {
    live: true,
    retry: true
}).on('change', function (change) {
    // yo, something changed!
    console.log('==> change: ', change);
    //console.log('==> change docs: ', JSON.stringify(change));
    change.change.docs.some(item => {
        if (item._id == 'controll') {
            console.log('controll changed !', item.request);
            writeCurrent();
            return true; // break
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

