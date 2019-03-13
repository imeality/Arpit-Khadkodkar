const router = require('express').Router();

const pool = require('../utilities/connection');

const auth = require('../utilities/auth');
var moment = require('moment');
var date = require('../utilities/date');
// user
router.post('/add', auth, (req, res) => {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "insert into enquiries (user_id, venue_id, sv_id, moderator_id, enquiry_type, start_date, end_date, start_time, end_time, budget, attendees) set ?";

        conn.query( sql, req.body, (err, result) => {

            conn.release();
            if (err) {             
                console.log(err);
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
});


router.patch('/edit/:enquiry_id', auth, (req, res) => {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "update enquiries set enquiry_type=?, start_date=?, end_date=?, start_time=?, end_time=?, budget=?, attendees=? where enquiry_id=?";

        conn.query( sql, req.params.enquiry_id, (err, result) => {

            conn.release();
            if (err) {             
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
});


router.delete('/delete/:enquiry_id', auth, (req, res) => {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "delete from enquiries where enquiry_id=?";

        conn.query( sql, req.params.enquiry_id, (err, result) => {

            conn.release();
            if (err) {             
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
})


router.get('/:user_id', auth, (req, res) => { // all enquiries for a particular user

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "select * from enquiries where user_id=?";

        conn.query( sql, req.params.enquiry_id, (err, result) => {

            conn.release();
            if (err) {             
                return res.status(500).end();
            }

            return res.status(200).json({
                data: result
            });
        })
    });
});


router.get('/:moderator_id', auth, (req, res) => { // all enquiries for a particular moderator

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "select * from enquiries where moderator_id=?";

        conn.query( sql, req.params.enquiry_id, (err, result) => {

            conn.release();
            if (err) {             
                return res.status(500).end();
            }

            return res.status(200).json({
                data: result
            });
        })
    });
});


router.get('/count/newEnquiries', auth, (req, res) => { // admin dashboard => new users in yesterday

    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        }

        var str = date.yesterdayDate();

        var sql = "select count(enquiry_id) as sum from enquiries where create_date like '"+str+"%' ";
        conn.query( sql, (err, result) => {

            conn.release();
            if ( err ) {
                return res.status(500).end();
            }
            console.log(" enquiry ocunt => ", result[0].sum);
            return res.status(200).json({
                data: result[0].sum
            });
        })
    });
})



module.exports = router;