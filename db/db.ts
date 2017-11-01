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

}