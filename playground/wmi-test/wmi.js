// wmi test module

var i = "abcde";
console.log('Hello world ' + i);


var WmiClient = require('wmi-client');

var wmi = new WmiClient({
    host: 'localhost'
});

wmi.query('SELECT * FROM Win32_OperatingSystem', function (err, result) {
    console.log(result);
});



// Comment