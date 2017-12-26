const core    = require("./core")
const storage = require('node-persist');

storage.initSync();
const storage_name = "ellicore_history"


var data = [
    { 
        buffer: new hbuffer (60, "second")
    },

    { 
        buffer: new hbuffer (60, "minute")
    },
    
    { 
        buffer: new hbuffer (24, "hour")
    },
]


// every second
setInterval(() => {
    var value = core.devices.bmv.data.V;
    data[0].buffer.add(value)
    //console.log("buffer", data)
}, 1000);

// every minute
setInterval(() => {
    var avg = data[0].buffer.avg()
    data[1].buffer.add(avg)
}, 60000);

// every hour
setInterval(() => {
    var avg = data[1].buffer.avg()
    data[2].buffer.add(avg)
}, 60000 * 60);


function hbuffer (size, name) {

    this._size   = size
    this._buffer = Array.apply(null, Array( size )).map( () => { return { value: 0, date: 0}});

    storage.getItem (storage_name + name).then ( 
        (value) => {
            this._size   = value.length
            this._buffer = value },
        (error) => { })


    this.add = function (value) {
        if (value) {
            this._buffer.push({
                value: value,
                date:  Date.now()
            })

            if (this._buffer.length > this._size) {
                this._buffer.shift()
            }

            storage.setItem (storage_name + name, this._buffer)
        }
    }

    this.sum = function () {
        return this._buffer.map( x => x.value ).reduce((a, b) =>  a + b )
    }

    this.avg = function () {
        return this.sum() / this._buffer.length;
    }
}




module.exports = data;