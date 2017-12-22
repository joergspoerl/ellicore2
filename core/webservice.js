// from: https://www.tutorialspoint.com/nodejs/nodejs_restful_api.htm

var express = require('express');
var app = express();
var fs = require("fs");

var victron_bmv = require("../io/victron_bmv");
var bmv = new victron_bmv("/dev/ttyUSB0")

var victron_mk2 = require("../io/victron_mk2.v2");
var mk2 = new victron_mk2("/dev/ttyUSB1")

//var bmv = require("../io/bmv");
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
    res.end(JSON.stringify(bmv.data));
})

app.get('/mk2', function (req, res) {
    res.end(JSON.stringify(mk2.data));
})
// app.get('/mk2/set_assist/:value', function (req, res) {
//     res.end( mk2.set_assist(req.params.value) );
// })
app.get('/mk2/object', function (req, res) {
    res.end(JSON.stringify(mk2));
})


app.get('/api/v1/mk2/:function_name/*', function (req, res) {
    console.log("req.query.value: ", req.query.value)
    var params = req.params[0].split('/');
    console.log("params: ", params)
    mk2[req.params.function_name].apply(null, params).then(
        (result) => {
            if (req.query.value) {
                res.end( result[req.query.value] );
            } else {
                res.end( JSON.stringify(result) );
            }
        },
        (error)  => {
            res.end( JSON.stringify(error) );
        })
})


// app.get('/tristar', function (req, res) {
//     var tristarData = tristar();
//     // console.log(bmvData);
//     res.end(JSON.stringify(tristarData));
// })


var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})