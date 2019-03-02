const express = require('express');
const router = express.Router();

const pool = require('../utilities/connection');

const jwt = require('jsonwebtoken');
const auth = require('../utilities/auth');

router.post('/login', (req, res) => {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "select";
    });
});




module.exports = router;