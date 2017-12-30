const storage = require('node-persist');

storage.initSync();

//values = storage.valuesWithKeyMatch(/^ellicore/);
//console.log("storage", JSON.stringify(values))

let values = storage
            .keys()
            .filter((key) => key.startsWith("ellicore_l1"))
            .sort()
            .reverse()
            .slice(-4)
            .map((key) => storage.getItemSync(key))
            .map((val) => Object.keys(val)) 

            //console.log("keys", JSON.stringify(keys))
console.log("values", JSON.stringify(values))
