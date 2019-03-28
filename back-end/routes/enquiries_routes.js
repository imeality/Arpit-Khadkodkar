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

router.get('/all/:rowscount/:offset',  (req, res) => {

    pool.getConnection( (err, conn) => {
        
        if (err) {
            conn.release();
            console.log(err)
            return res.status(500).end();
        }
     
        conn.query( "select * from enquiries limit ? offset ?",[parseInt(req.params.rowscount),parseInt(req.params.offset)], (err, results) => {
            conn.release();
            
            if(err) {
                console.log(err)
                return res.status(500).end();
            }
            //console.log("inside enquiries/all => resutl == ",results);
            //console.log("result ", results);
            return res.status(200).json({
                data: results
            });
        
        });
    });
})

router.get('/rowsCount',  (req, res) => { // for admin dashboard => total number of bookings
    
    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            console.log(err);
            return res.status(500).end();
        }
        
        var sql = "select count(enquiry_id) as sum from enquiries";
        conn.query( sql, (err, result) => {

            conn.release();
            if ( err ) {
                console.log(err);
                return res.status(500).end();
            }
            //console.log("inside enquiries/rowsCount => resutl == ",result);
            return res.status(200).json({
                data: result[0].sum
            });
        })
    });
})

router.patch('/edit/:enquiry_id', auth, (req, res) => {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            console.log(err);
            return res.status(500).end();
        }
        //console.log();
        conn.query( "update enquiries set ? where enquiry_id=?", [req.body, req.params.enquiry_id], (err, result) => {
            conn.release();
            if (err) {      
                console.log(err);       
                return res.status(500).end();
            }
            //console.log();
            return res.status(200).end();
        })
    });
});

router.delete('/delete/:enquiry_id', auth, (req, res) => {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            console.log(err);
            return res.status(500).end();
        }

        var sql = "update enquiries set status = 'deleted' where enquiry_id=?";

        conn.query( sql, req.params.enquiry_id, (err, result) => {

            conn.release();
            if (err) {   
                console.log(err);          
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
})

router.get('/byUserId/:user_id', auth, (req, res) => { // all enquiries for a particular user

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

router.get('/byModeratorId/:moderator_id', auth, (req, res) => { // all enquiries for a particular moderator

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
          //  console.log(" enquiry ocunt => ", result[0].sum);
            return res.status(200).json({
                data: result[0].sum
            });
        })
    });
})

module.exports = router;