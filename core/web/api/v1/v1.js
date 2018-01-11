const express = require('express');
const router = express.Router();
router.use('/get',     require('./get/get.js'));
router.use('/call',    require('./call/call.js'));
//router.use('/history', require('./history/history.js'));

module.exports = router;