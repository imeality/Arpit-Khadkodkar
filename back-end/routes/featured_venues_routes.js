const router = require('express').Router();

const pool = require('../utilities/connection');

const auth = require('../utilities/auth');


router.post('/add/:venue_id', auth, (req, res) => {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var promise1 = new Promise ( (resolve, reject) => {
            conn.query( "insert into featuredVenues  values (?,?,?)", [req.params.venue_id, req.body.start_date, req.body.end_date], (err, result) => {
                if (err) {
                    reject('error');
                } else {
                    resolve('success');
                }
            })
        }) 

        var promise2 = new Promise ( (resolve, reject) => {
            conn.query( "update venues set featured = '1' where venue_id=?", req.params.venue_id, (err, result) => {
                if (err) {
                    reject('error');
                } else {
                    resolve('success');
                }
            })
        }) 

        Promise.race( [promise1, promise2] )
        .then( values => {
            console.log(" --- values ---  ", values);
        })
      
        setTimeout( () => {
            conn.release();
            return res.status(200).end();
        }, 300);

    });
});

router.patch( '/extend/:venue_id', (req,res) => { // when moderator wants to extend its featured period

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        conn.query( "upadate featuredVenues set expiry_date = ? where venue_id = ?", [req.params.venue_id, req.body.expiry_date], (err, result) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).end();
        });
    });
});

module.exports = router;