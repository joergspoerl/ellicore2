const NodeCouchDb = require('node-couchdb');


// node-couchdb instance talking to external service 
const couchExternal = new NodeCouchDb({
    host: 'localhost',
    protocol: 'http',
    port: 5984,
    auth: {
        user: 'administrator',
        pass: 'Passw0rd!'
    }
});




