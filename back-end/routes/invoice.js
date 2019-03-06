var router = require('express').Router();
var pool = require('../utilities/connection');

router.get('/:booking_id', (req, res) => { // moderator

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release()
            return res.status(500).end();
        }
        var sql = "select invoice_id, payment_id, amount, date from invoice where booking_id = ?";
        conn.query(sql, req.params.booking_id, (err, results) => {

            conn.release();
            if(err) {
                console.log(err);
                return res.status(500).end();
            }

            console.log("-- result ", results);

            return res.status(200).json({
                data: results,
            });
        });
    });
});

router.get('/:payment_id', (req, res) => { // moderator

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release()
            return res.status(500).end();
        }
        var sql = "select invoice_id, booking_id, amount, date from invoice where payment_id = ?";
        conn.query(sql, req.params.payment_id, (err, results) => {

            conn.release();
            if(err) {
                console.log(err);
                return res.status(500).end();
            }

            console.log("-- result ", results);

            return res.status(200).json({
                data: results,
            });
        });
    });
});

router.get('/:invoice_id', (req, res) => { // moderator

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release()
            return res.status(500).end();
        }
        var sql = "select booking_id, payment_id, amount, date from invoice where invoice_id = ?";
        conn.query(sql, req.params.invoice_id, (err, results) => {

            conn.release();
            if(err) {
                console.log(err);
                return res.status(500).end();
            }

            console.log("-- result ", results);

            return res.status(200).json({
                data: results,
            });
        });
    });
});


router.get('/', (req, res) => { // admin

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release()
            return res.status(500).end();
        }
        var sql = "select * from invoice";
        conn.query(sql, (err, results) => {

            conn.release();
            if(err) {
                console.log(err);
                return res.status(500).end();
            }

            console.log("-- result ", results);

            return res.status(200).json({
                data: results,
            });
        });
    });
});


router.post('/add', (req, res) => {
   
    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release()
            return res.status(500).end();
        }
        var sql = "insert into invoice set ? ";
        conn.query(sql, req.body.data, (err, results) => {

            conn.release();
            if(err) {
                console.log(err);
                return res.status(500).end();
            }

            console.log("-- result ", results);

            return res.status(201).end();
        });
    });
})

module.exports = router;