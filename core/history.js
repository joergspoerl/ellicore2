const core = require("./core")

var data = [
    { 
        buffer: new hbuffer (60)
    },

    { 
        buffer: new hbuffer (60)
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

//    var sum = data[0].buffer.sum()
    var avg = data[0].buffer.avg()
    console.log("sum", data[0].buffer.sum())

    console.log("avg", avg)


    data[1].buffer.add(avg)

}, 10000);



function hbuffer (size) {
    this._size   = size
    this._buffer = Array.apply(null, Array( size )).map( () => { return { value: 0, date: 0}});

    this.add = function (value) {
        if (value) {
            this._buffer.push({
                value: value,
                date:  Date.now()
            })

            if (this._buffer.length > this._size) {
                this._buffer.shift()
            }
        }
    }

    this.sum = function () {
        return this._buffer.map( x => x.value ).reduce(function(a, b) { 
            console.log("a, b", a, b)
            return a + b
        })
    }

    this.avg = function () {
        return this.sum() / this._buffer.length;
    }
}




module.exports = data;