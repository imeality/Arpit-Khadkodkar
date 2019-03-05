const router = require('express').Router();

const pool = require('../utilities/connection');

const auth = require('../utilities/auth');

router.post('/add', (req, res) => {  // add offers by moderator

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

      
       var data = req.body;

        var promise1 = new Promise ( (resolve, reject) => {
            conn.query( "insert into offers (venue_id, moderator_id, discount, starting_date, expiry_date) values (?,?,?,?,?)", [data.venue_id, data.moderator_id, data.discount, data.starting_date, data.expiry_date], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve('success');
                }
            })
        }).catch ( error => {
            console.log(" error caught ", error)
        }) 

        var promise2 = new Promise ( (resolve, reject) => {
            conn.query( "update venues set offers = 1 where venue_id=?", req.body.venue_id, (err, result) => {
                if (err) {
                    reject('error');
                } else {
                    resolve('success');
                }
            })
        }) 

        Promise.race( [promise1, promise2] )
        .then( () => {
            
            conn.release();
            return res.status(200).end();
        })

    });
});


router.patch('/edit/:offers_id', (req, res) => { //  edit

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "update offers set discount=?, expiry_date=? where offers_id=?";

        conn.query( sql, req.params.offers_id, (err, result) => {

            conn.release();
            if (err) {             
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
});


router.delete('/delete/:offers_id/:venue_id', (req, res) => { // delete 

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var promise1 = new Promise ( (resolve, reject) => {
            conn.query( "delete from offers where offers_id = ?", req.params.offers_id, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve('success');
                }
            })
        }).catch ( error => {
            console.log(" error caught ", error)
        }) 

        var promise2 = new Promise ( (resolve, reject) => {
            conn.query( "update venues set offers = 0 where venue_id=?", req.params.venue_id, (err, result) => {
                if (err) {
                    reject('error');
                } else {
                    resolve('success');
                }
            })
        }) 

        Promise.race( [promise1, promise2] )
        .then( () => {
            
            conn.release();
            return res.status(200).end();
        })

    });
});

module.exports = router;