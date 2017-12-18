var victron_mk2 = require('./victron_mk2')
var victron_bmv = require('./victron_bmv')


function test () {
    var bmv = new victron_bmv("/dev/ttyUSB0");

    setInterval (() => {
        console.log(bmv.data.V.value)
    },10000)
}
test();