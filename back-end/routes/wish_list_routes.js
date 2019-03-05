const router = require('express').Router();

const pool = require('../utilities/connection');

const auth = require('../utilities/auth');

router.post('/add/:user_id/:venue_id', auth, (req, res) => {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "insert into wishList values (?,?)";

        conn.query( sql, [req.params.user_id, req.params.venue_id], (err, result) => {

            conn.release();
            if (err) {             
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
});


router.post('/delete/:wish_list_id', auth, (req, res) => {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "delete from wishList where wish_list_id = ?";

        conn.query( sql, req.params.wish_list_id, (err, result) => {

            conn.release();
            if (err) {             
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
});


module.exports = router;