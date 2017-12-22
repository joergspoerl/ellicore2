const express = require('express');
const router = express.Router();
router.use('/hello', (req, res, next ) => {
    res.end ("Hallo Welt")
});
router.use('/', (req, res, next ) => {
    res.end ("Default")
});
module.exports = router;