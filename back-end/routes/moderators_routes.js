const router = require('express').Router();
const jwt = require('jsonwebtoken');
const auth = require('../utilities/auth');
const pool = require('../utilities/connection');
const moment = require('moment');
// var date = require('../utilities/date');


router.post('/login', (req,res) => { // for login
    pool.getConnection( (err, conn) => {
        if (err) {
            conn.release();
            return res.status(500).end();
        }
        var sql = " select * from moderators where email = ? and password = ?";
        var para = req.body;
        conn.query( sql, [para.email, para.password], (err, results) => {   
            if(err) {
                conn.release();
                console.log('----login----',err);
                return res.status(500).end();
            }
            var len = results.length;
            if( len == 0 ) {
                conn.release();
                return res.status(401).json({
                    status: "not exist"
                })
            }
            if ( len == 1 ) {
                var result = results[0]; 
                var status = result.status;
                if ( status == 'confirmed' ) {
                    var date = moment().format('LLL');
                    conn.query("update moderators set last_logged_in =? where moderator_id=?", [date, results[0].moderator_id], (err, result) => {
                        conn.release();
                        if(err) {
                            return res.status(500).end();
                        }
                        let token = jwt.sign(
                            {
                                email: email
                            },
                            'Just-use-this-string-as-secret',
                            {
                                expiresIn: '2hr'
                            }
                        );
                        return res.status(200).json({
                            token: token,
                            moderator_id: results[0].moderator_id,
                            name: results[0].name,
                            contact_num: results[0].contact_num
                        })
                    }) 
                }
                if ( status == 'temporary' ) {
                    conn.release();
                    return res.status(401).json({
                        status: "temporary"
                    })
                } else {
                    conn.release();
                    return res.status(401).json({
                        status: 'blocked'
                    })
                }
            }
        })
    });
});


router.post('/registration', (req,res) => { // for registration

    pool.getConnection( (err, conn) => {
        
        if (err) {
            conn.release();
            return res.status(500).end();
        }
        var data = req.body;
        var sql = "select status from moderators where email = ? and not password = '' ";

        conn.query( sql, data.email, (err, results) => {
            
            if (err) {
                conn.release();
                return res.status(500).end();
            }

            if ( results.length != 0 ) {
                conn.release();
                return res.status(409).end();  // 409 shows conflict
            }
            var date = moment().format('LLL');
            sql = "insert into moderators (name, email, password, contact_num, status, sign_up_date, last_logged_in) values (?,?,?,?, 'temporary',?,'') ";

            conn.query( sql, [data.name, data.email, data.password, data.contact_num, date], (err, results) => {
                conn.release();

                if (err) {
                    return res.status(500).end();
                }

                return res.status(201).end(); // for created
            });
        })
    });
});


router.delete('/delete/:moderator_id', (req, res) => { // delete account

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "update moderators set status = 'deleted' and password = '' where moderator_id = ?";

        conn.query( sql, req.params.moderator_id, (err, results) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).end();
        });
    });
});


router.patch('/edit/:moderator_id', (req, res) => { // edit profile

    pool.getConnection( (err, conn) => {
        
        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "update moderators set email = ?, name = ?, contact = ? where moderator_id = ?";
        var data = req.body;

        conn.query( sql, [data.email, data.name, data.contact_num], (err, results) => {
            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).end();
        });
    });
});


router.post('/checkPassword/:moderator_id', (req, res) => {  // when moderator want to update password first needs to verify it

    pool.getConnection ( (err, conn) => {
        if(err){
            conn.release();
            return res.status(500).end();
        }

        var sql = "select status from moderators where moderator_id = ? and password = ?";

        conn.query( sql, [req.body.password, req.params.moderator_id], (err, rows) => {
            
            conn.release();

            if (err){     
                return res.status(500).end();
            }

            if( rows.length == 0 ){
                return res.status(401).end();
            }else{
                return res.status(200).end();
            }
        });
    });
});


router.post('/editPassword/:moderator_id', (req, res) => {  //  when moderator want to edit password

    pool.getConnection ( (err, conn) => {

        if(err){
            conn.release();
            return res.status(500).end();
        }
        
        var sql = "update moderators set password = ? where moderator_id = ?";

        conn.query( sql, [req.body.password, req.params.moderator_id], (err, results) => {
            conn.release();

            if(err){
                return res.status(500).end();
            }

            return res.status(200).end();
        })        
    });
})


router.patch('/permit/:moderator_id', auth, (req, res) => { // when admin permit moderator to create account or when admin want to unblock moderator

    pool.getConnection( (err, conn) => {

        if(err){
            conn.release();
            return res.status(500).end();
        }
        
        var sql = "update moderators set status = 'confirmed' where moderator_id = ?";

        conn.query( sql, req.params.moderator_id, (err, result) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
});


router.patch('/block/:moderator_id', auth, (req, res) => { // admin can block moderator

    pool.getConnection( (err, conn) => {

        if(err){
            conn.release();
            return res.status(500).end();
        }
        
        var sql = "update moderators set status = 'blocked' where moderator_id = ?";

        conn.query( sql, req.params.moderator_id, (err, result) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
})


router.get('/', auth, (req, res) => { // admin can see all the moderators

    pool.getConnection( (err, conn) => {

        if(err){
            conn.release();
            return res.status(500).end();
        }
        
        conn.query( "select * from moderators", (err, results) => {
            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).json({
                moderators: results
            });
        }) 

    });
});


router.get('/temporary', auth, (req, res) => { // admin view all the new moderators

    pool.getConnection( (err, conn) => {

        if(err){
            conn.release();
            return res.status(500).end();
        }
        
        conn.query( "select * from moderators where status = 'temporary'", (err, results) => {
            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).json({
                data: results
            });
        }) 

    });
})


router.get('/count/temporary', auth, (req, res) => { // admin dashboard => count of all requests

    pool.getConnection( (err, conn) => {

        if(err){
            conn.release();
            return res.status(500).end();
        }
        
        conn.query( "select count(moderator_id) as sum from moderators where status = 'temporary'", (err, results) => {
            conn.release();
            if (err) {
                return res.status(500).end();
            }
         //   console.log("moderaotor count => ",results[0].sum);
            return res.status(200).json({
                data: results[0].sum
            });
        }) 

    });
})


router.delete('/delete/newmoderator/:moderator_id', auth, (req, res) => { // admin can delete temporary moderators

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "delete from moderators where moderator_id = ?";

        conn.query( sql, req.params.moderator_id, (err, results) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).end();
        });
    });
});




module.exports = router;