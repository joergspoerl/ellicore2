const express = require('express');
const router = express.Router();
router.use('/history', require('./history/history.js'));

module.exports = router;