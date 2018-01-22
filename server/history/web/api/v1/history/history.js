const express = require('express');
const db      = require('../../../../db/db');
const router  = express.Router();

router.get('/test/:value_path', function (req, res) {
    result = "Hello World"
    res.end( JSON.stringify(result)  + '\n\r');
})

router.get('/get/:level/:source_id', function (req, res) {
    db.history.get(req.params.level, req.params.source_id).then(
        (rows) => {
            res.end( JSON.stringify(rows)  + '\n\r');
        },
        (error) => {
            res.end( JSON.stringify(error)  + '\n\r');
        }
    )
})


module.exports = router;