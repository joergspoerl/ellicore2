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
router.use('/', (req, res, next ) => {
    res.end ("Default")
});
module.exports = router;