const core    = require("./core")
const storage = require('node-persist');
const nh      = require("./nested_helper");

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
    //var value = core.devices.bmv.data.V;
    var value = {}
    nh.copy_nested_property(value, "bmv.data", core.devices.bmv.data)
    nh.copy_nested_property(value, "mk2.data", core.devices.mk2.data)
    nh.copy_nested_property(value, "mppt.data", core.devices.mppt.data)
    data[0].buffer.add(value)
    //console.log("buffer", data)
}, 1000);

// every minute
setInterval(() => {
    var avg = data[0].buffer.calc_stat()
    data[1].buffer.add(avg)
}, 10000);

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

    this.calc_stat = function() {
        nh.iter_obj (this._buffer[0].value, "", (obj, path, key) => {
            //console.log("obj[key]", obj[key], "path", path, "key", key)
            var val_array = this._buffer.map( x => nh.nestedProperty.get(x, "value" + path) )
            var numbers   = val_array.filter( x => typeof x === "number")
            var sum       = numbers.reduce((a, b) =>  a + b )
            var avg       = sum / numbers.length;
            //console.log("va", va, "sum", sum, "avg", avg)
        })
         
    }

    this.sum = function (array) {
        return array.reduce((a, b) =>  a + b )
    }

    this.avg = function () {
        return this.sum() / this._buffer.length;
    }
}




module.exports = data;