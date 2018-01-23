var app  = require('express')();
var cors = require('cors')

app.use(cors())

// anything beginning with "/api" will go into this
app.use('/api', require('./api/api.js'));

app.listen(8082);
console.log("Server is started")