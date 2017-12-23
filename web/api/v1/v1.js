const express = require('express');
const router = express.Router();
router.use('/get', require('./get/get.js'));
router.use('/call', require('./call/call.js'));

module.exports = router;