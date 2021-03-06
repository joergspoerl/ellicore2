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

function add_current () {
    let current = {}
    nh.copy_nested_property(current, "bmv.data",  core.devices.bmv.data)
    nh.copy_nested_property(current, "mk2.data",  core.devices.mk2.data)
    nh.copy_nested_property(current, "mppt.data", core.devices.mppt.data)
    add_item(data.seconds, current)
}

var maxCallback = ( max, cur ) => Math.max( max, cur );
var minCallback = ( min, cur ) => Math.min( min, cur );


function calc_stat (buffer) {
    var result = {}
    nh.iter_obj (buffer[59], "", (obj, path, key) => {
        //console.log("obj[key]", obj[key], "path", path, "key", key)
        var val_array = buffer.map( x => nh.nestedProperty.get(x, path.substring(1)) )
        var numbers   = val_array.filter( x => typeof x === "number")
        var sum    = numbers.reduce((a, b) =>  a + b , 0)
        var avg    = sum / numbers.length;
        var min    = numbers.reduce(minCallback, Infinity)
        var max    = numbers.reduce(maxCallback, -Infinity)

        nh.nestedProperty.set(result, path.substring(1), {
            avg: avg,
            min: min,
            max: max
        })
    })

    return result
}




setInterval(() => {
    add_current()
}, 1000)


setInterval(() => {
    add_item (data.minutes, calc_stat(data.seconds))
    storage.setItemSync('ellicore_minutes',data.minutes);
}, 60000)


var data = {
    seconds: init_array(60),
    minutes: init_array(60),
    hours:   init_array(24),

    diagramm_seconds: diagramm_seconds,
    diagramm_minutes: diagramm_minutes,
}

get_stored_items();

function get_stored_items () {
    let seconds = storage.getItemSync('ellicore_seconds');
    let minutes = storage.getItemSync('ellicore_minutes');
    let hours   = storage.getItemSync('ellicore_hours');

    if (seconds) {
        data.seconds = seconds
    }
    if (minutes) {
        data.minutes = minutes
    }
    if (hours) {
        data.hours = hours
    }
}

function diagramm_seconds (value_path) {
    var val_array = data.seconds.map( x => nh.nestedProperty.get(x, value_path) )
    var y   = val_array.filter( x => typeof x === "number")  //.slice(-20)
    var x   =  Array.apply(null, Array( y.length )).map( () => "-")
    return { value_path: value_path, x:x, y:y};
}

function diagramm_minutes (value_path) {
    var val_array = data.minutes.map( x => nh.nestedProperty.get(x, value_path + ".avg") )
    var y   = val_array.filter( x => typeof x === "number")  //.slice(-20)

    var val_array = data.minutes.map( x => nh.nestedProperty.get(x, value_path + ".min") )
    var min   = val_array.filter( x => typeof x === "number")  //.slice(-20)

    var val_array = data.minutes.map( x => nh.nestedProperty.get(x, value_path + ".max") )
    var max   = val_array.filter( x => typeof x === "number")  //.slice(-20)

    var x   =  Array.apply(null, Array( y.length )).map( () => "-")
    return { value_path: value_path, x:x, y:y, min:min, max:max};
}

module.exports = data;

/* ----------------------------------------------------------- */
