const express = require('express');
const router = express.Router();
var core = require('../../../../core/core');
console.log("core: ", core)

router.use('/hello', (req, res, next ) => {
    res.end ("Hallo Welt")
});
router.use('/core', (req, res, next ) => {
    res.end (JSON.stringify(core))
});

router.get('/mk2/:function_name/*', function (req, res) {
    console.log("req.query.value: ", req.query.value)
    var params = req.params[0].split('/');
    console.log("params: ", params)
    core.devices.mk2[req.params.function_name].apply(null, params).then(
        (result) => {
            if (req.query.value) {
                res.end( result[req.query.value] );
            } else {
                res.end( JSON.stringify(result) );
            }
        },
        (error)  => {
            res.end( JSON.stringify(error) );
        })
})


router.use('/', (req, res, next ) => {
    res.end ("Default")
});
module.exports = router;