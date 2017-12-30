const core    = require("./core")
const storage = require('node-persist');
const nh      = require("./nested_helper");

storage.initSync();
const storage_name = "ellicore_history"

function init_array (size) {
    return Array.apply(null, Array( size )).map( () => undefined);
}

function add_item (buffer, item) {
    buffer.push(item)
    buffer.shift()
    return buffer
}


var data = {
    seconds: {
        _limit: 60,
    },
    minutes: {
        _limit: 60,
    },
    hours:   {
        _limit: 24,
    },

}

function collect_data (target, source, name_prefix, next_level_cb) {
    target._counter = target._counter || 0
    target._counter++
    nh.iter_obj (source, "", (obj, path, key) => {
        //console.log("obj[key]", obj[key], "path", path, "key", key)
        if (!target[name_prefix + path]) {
            target[name_prefix + path] = []
        }
        target[name_prefix + path].push (obj[key])  // add value
        if (target[name_prefix + path].length > target._limit) {
            target[name_prefix + path].shift()
        }
    })
    if (target._counter > target._limit) {
        target._counter = 0
        if (next_level_cb) next_level_cb()
    }
}

var maxCallback = ( max, cur ) => Math.max( max, cur );
var minCallback = ( min, cur ) => Math.min( min, cur );


function calc_stat (target, source) {

    for (var key in source) {
        if (!key.startsWith("_")) {
            console.log("key", key, "source[key]", source[key])
            let numbers = source[key]
    
            let sum    = numbers.reduce((a, b) =>  a + b , 0)
            let val    = sum / numbers.length;
            let min    = numbers.reduce(minCallback, Infinity)
            let max    = numbers.reduce(maxCallback, -Infinity)
    
            console.log("key", key, source[key])
    
            if (!target[key]) target[key] = []
            target[key].push ({
                val: val,
                min: min,
                max: max
            })
    
        }
    }
    
}


setInterval ( () => {

    collect_data (data.seconds, core.devices.bmv.data, "bmv.data", () => {
        console.log("next level")
        calc_stat(data.minutes, data.seconds)
        store_minutes();
    })
    //console.log (data.seconds)
}, 1000)


function store_minutes () {
    storage.setItemSync('ellicore_l1_' + Date.now(), data.minutes);
}






module.exports = data;

/* ----------------------------------------------------------- */
