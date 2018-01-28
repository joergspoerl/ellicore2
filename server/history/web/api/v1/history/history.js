const express = require('express');
const db      = require('../../../../db/db');
const router  = express.Router();

router.get('/test/:value_path', function (req, res) {
    result = "Hello World"
    res.end( JSON.stringify(result)  + '\n\r');
})

router.get('/data/:level/:source_id/:limit', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    db.history.data(req.params.level, req.params.source_id, req.params.limit).then(
        (rows) => {
            res.end( JSON.stringify(rows)  + '\n\r');
        },
        (error) => {
            res.end( JSON.stringify(error)  + '\n\r');
        }
    )
})


router.get('/source/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    db.history.source().then(
        (rows) => {
            res.end( JSON.stringify(rows)  + '\n\r');
        },
        (error) => {
            res.end( JSON.stringify(error)  + '\n\r');
        }
    )
})

module.exports = router;