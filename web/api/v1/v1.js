const express = require('express');
const router = express.Router();
router.use('/current', require('./current/current.js'));
module.exports = router;