const express = require('express');
const router = express.Router();
var core = require('../../../../core/core');


router.get('/:device/:function_name/*', function (req, res) {
    console.log("req.query.value:", req.query.value)
    var params = req.params[0].split('/');
    console.log("params: ", params)
    core.devices[req.params.device][req.params.function_name].apply(null, params).then(
        (result) => {
            if (req.query.value) {
                res.end( result[req.query.value] + '\n\r');
            } else {
                res.end( JSON.stringify(result)  + '\n\r');
            }
        },
        (error)  => {
            res.end( JSON.stringify(error)  + '\n\r');
        })
})


router.use('/', (req, res, next ) => {
    res.end ("Default")
});
module.exports = router;