// from: https://www.tutorialspoint.com/nodejs/nodejs_restful_api.htm

var express = require('express');
var app = express();
var fs = require("fs");

var bmv = require("../io/bmv.js");
//var tristar = require("../io/tristar.js");

//app.get('/index.html', function (req, res) {
//    fs.readFile(__dirname + "/" + "index.html", 'utf8', function (err, data) {
//        console.log(data);
//        res.end(data);
//    });
//})

// from: http://expressjs.com/de/starter/static-files.html
app.use(express.static('public'));

app.get('/bmv', function (req, res) {
    var bmvData = bmv();
    // console.log(bmvData);
    res.end(JSON.stringify(bmvData));
})

app.get('/tristar', function (req, res) {
    var tristarData = tristar();
    // console.log(bmvData);
    res.end(JSON.stringify(tristarData));
})


var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})