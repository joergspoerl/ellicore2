const core = require("./core")

var limit  = 20;
var buffer = Array.apply(null, Array(limit)).map(Number.prototype.valueOf,0);

setInterval(() => {
    var v = core.devices.bmv.data.V;

    if (v) {
        buffer.push(v)

        if (buffer.length > limit) {
            buffer.shift()
        }
    }
    
    

    console.log("buffer", buffer)

}, 1000);

module.exports = buffer;