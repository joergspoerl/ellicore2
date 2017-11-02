import * as PouchDB from "pouchdb";
import { ICurrentDoc } from '../types/ICurrentDoc'

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
            info => console.log("getInfo -> info: ", info),
            error =>console.log("getInfo -> error: ", error)
        )
        this.dbRemote.info().then(
            info => console.log("getInfo -> info: ", info),
            error =>console.log("getInfo -> error: ", error)
        )
    }


    compact () {
        this.dbLocal.compact().then(
            info => console.log("compact -> info: ", info),
            error =>console.log("compact -> error: ", error)
        )
        this.dbRemote.compact().then(
            info => console.log("compact -> info: ", info),
            error =>console.log("compact -> error: ", error)
        )
    }


    sync () {
        this.dbLocal.sync(this.dbRemote).then(
            info => console.log("sync -> info: ", info),
            error =>console.log("sync -> error: ", error)
        )
    }


    writeCurrent(newValue:ICurrentDoc) {
        this.dbLocal.get("current").then(
            current => {
                newValue._id = current._id;
                newValue._rev = current._rev;
                this.dbLocal.put(current).then(
                    ok => {
                        console.log("current value saved !");
                        this.sync();
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
    
    startTimer (cb:any) {
        let self = this;
        let tristar = cb();


        setInterval(function() {
            var doc:ICurrentDoc = {
                _id: 'current',
                _rev: '',                
                date: Date.now(),
                tristar: cb(),
                bmv: null,
                mk2: null
            }
            self.writeCurrent(doc);
        }, 60000); // every minute


        setInterval(function() {
            self.compact();
        }, 60000 * 60); // every hour
    }
}