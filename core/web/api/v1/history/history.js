const express = require('express');
const router  = express.Router();
const core    = require('../../../../core');
const history = require('../../../../history');

router.get('/diagramm/:value_path', function (req, res) {
    var result = history.diagramm(req.params.value_path);
    console.log("req.param.value_path", req.params.value_path)
    res.end( JSON.stringify(result)  + '\n\r');
})

router.get('/', function (req, res) {
    var result = history;
    res.end( JSON.stringify(result)  + '\n\r');
})

router.get('/*', function (req, res) {
    var result = getNested (history, req.params[0], "/");
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