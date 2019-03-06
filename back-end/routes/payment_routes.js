var router = require('express').Router();
var pool = require('../utilities/connection');


router.get('/:moderator_id', (req, res) => { // moderator

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release()
            return res.status(500).end();
        }
        var sql = "select payment_id, transaction_id, booking_id, amount, bill_image, date, status, mode_of_payment from paymentReceived where moderator_id = ?";
        conn.query(sql, req.params.moderator_id, (err, results) => {

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

router.get('/:booking_id', (req, res) => { // moderator

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release()
            return res.status(500).end();
        }
        var sql = "select payment_id, transaction_id, moderator_id, amount, bill_image, date, status, mode_of_payment from paymentReceived where booking_id = ?";
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
        var sql = "select transaction_id, booking_id, moderator_id, amount, bill_image, date, status, mode_of_payment from paymentReceived where payment_id = ?";
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

router.post('/add', (req, res) => { // moderator

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release()
            return res.status(500).end();
        }
        var sql = "insert into paymentReceived set ?";
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
});


router.patch('/edit/:payment_id', (req, res) => { // moderator

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release()
            return res.status(500).end();
        }
        var sql = "update paymentReceived set transaction_id=?, booking_id=?, amount=?, date=?, status=?, mode_of_payment=? where payment_id=?";
        conn.query(sql, [req.body.data, req.params.payment_id], (err, results) => {

            conn.release();
            if(err) {
                console.log(err);
                return res.status(500).end();
            }

            console.log("-- result ", results);

            return res.status(201).end();
        });
    });
});

router.get('/:status', (req, res) => { // admin

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release()
            return res.status(500).end();
        }
        var sql = "select payment_id, transaction_id, booking_id, moderator_id, amount, bill_image, date, mode_of_payment from paymentReceived where status = ?";
        conn.query(sql, req.params.status, (err, results) => {

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

module.exports = router;