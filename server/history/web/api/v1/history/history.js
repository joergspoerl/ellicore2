const express = require('express');
const router  = express.Router();

router.get('/test/:value_path', function (req, res) {
    result = "Hello World"
    res.end( JSON.stringify(result)  + '\n\r');
})

module.exports = router;