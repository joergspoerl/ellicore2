var nestedProperty = require("nested-property");


function iter_obj (obj, path, cb) {
    for (var key in obj) {
        if (obj[key] !== null && typeof obj[key] === "object") {
          // Recurse into children
          iter_obj(obj[key], path + "." + key, cb);
        } else {
            cb(obj, path + "." + key, key);
        } 
    }
}


function copy_nested_property(target, path, obj) {

    iter_obj(obj, path, (obj, path, key) => {
        if (typeof obj[key] === 'number' ) {
            var full_name = path + "." + key
            console.log("path: ", full_name + ': ' + obj[key]);
            nestedProperty.set(target, full_name, obj[key])
        }

    })
}

module.exports = {
    iter_obj:             iter_obj,
    copy_nested_property: copy_nested_property
}