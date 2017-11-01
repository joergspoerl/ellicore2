import * as PouchDB from "pouchdb";

export class DbCurrent {

    dbName: string = 'ellicore-current';
    dbRemoteUrl: string = ''
    dbCredentials = require('./dbCredentials.json');
    
    pouchOptions: any = {
        auto_compaction: true,
        //revs_limit: 1
    }

    dbLocal: PouchDB.Database;
    dbRemote: PouchDB.Database;

    constructor () {

        this.dbLocal = new PouchDB  (this.dbCredentials.name, this.pouchOptions);
        this.dbRemote = new PouchDB ('https://'
        + this.dbCredentials.usr + ':' + this.dbCredentials.pwd + '@'
        + this.dbCredentials.url + this.dbCredentials.name, this.pouchOptions);
    }


    getInfo () {
        this.dbLocal.info().then(
            info => console.log("info: ", info),
            error =>console.log("error: ", error)
        )
        this.dbRemote.info().then(
            info => console.log("info: ", info),
            error =>console.log("error: ", error)
        )
    }



    writeCurrent(newValue:any) {
        this.dbLocal.get("current").then(
            current => {
                newValue._id = current._id;
                newValue._rev = current._rev;
                this.dbLocal.put(current).then(
                    ok => {
                        console.log("current value saved !")
                    }
                )
            },
            error => {
                if (error.status == 404) {
                    newValue._id = 'current';
    
                    this.dbRemote.put(newValue).then(
                        ok => {
                            console.log("current value created !")
                        })
                }
                console.log("ERROR: ", error);
            }
        )
    
    }
    
    writeCurrentWithTimer (cb:any) {
        let self = this;
        let tristar = cb();

        setInterval(function() {
            console.log("Interval ...")
            var doc = {
                date: Date.now(),
                tristar: tristar
            }
            self.writeCurrent(doc);
        }, 10000);
    }
}