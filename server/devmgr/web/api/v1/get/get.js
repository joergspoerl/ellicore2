const express = require('express');
const router  = express.Router();
const core    = require('../../../../devmgr');

router.get('/*', function (req, res) {
    var result = getNested (core.devices, req.params[0], "/");
    res.end( JSON.stringify(result)  + '\n\r');
})


function getNested (theObject, path, separator) {
    try {
        separator = separator || '.';
    
        return path.
                replace('[', separator).replace(']','').
                split(separator).
                reduce(
                    function (obj, property) { 
                        return obj[property];
                    }, theObject
                );
                    
    } catch (err) {
        return undefined;
    }   
}


module.exports = router;