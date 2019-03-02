const express = require('express');
const router = express.Router();

const step = require('step');

const jwt = require('jsonwebtoken');
const auth = require('../utilities/auth');

var pool = require('../utilities/connection');

router.post('/login', (req, res) => {  // for login
    console.log("login   ");
    pool.getConnection((err, conn) => {
        if(err){
            console.log("login connection error:  ", err);
            conn.release();
            return  res.status(500).end();
        }
        var data = req.body;
        var email = data.user_email, pass = data.user_password;
        var sql = "select * from users where user_email = ? and user_password = ? and status = 'active'";
        conn.query(sql, [ email, pass ], function(err, result) {
            
            if(err){
                conn.release();
                return res.status(500).end();
            }   
            var len = result.length;
            
            
            if(len == 0){
                conn.release();
                return res.status(401).end();
            }
            
            const token = jwt.sign(
                {                
                    email: email
                },
                'Just-use-this-string-as-secret',
                {
                    expiresIn: '2hr'
                }
    
            )
            conn.release();
            return res.status(200).json({
                
                user_id: result[0].user_id,
                user_type: result[0].user_type,
                user_name: result[0].user_name,
                user_email: result[0].user_email,
                token: token
            })
        });
        
    })
})


router.post('/registration', (req,res) => {  // for registration
    pool.getConnection((err, conn) => {
        if ( err ) {
            conn.release();
            return res.status(500).end();
        }
        var data = req.body;
        var status = "active";
        
        step (
            function start () {
                var sql = "select status from users where user_email = ?";
                conn.query(sql, data.user_email, this);
            },
            function insertRow (error, rows) {
                if(error){
                    console.log("insert row error  ");
                    conn.release();
                    
                    return res.status(500).end();
                }
                var len = rows.length;
                if(len != 0 ) {
                    
                    for ( let i=0; i++; i<len ) {
                        if ( rows[i].status == 'active' || rows[i].status == 'blocked' ) {
                            console.log("insert row error  conflict  ");
                            conn.release();
                            return res.status(409).end();  // 409 shows conflict
                        }
                    }
                    
                }else {
                    console.log("--- inside insertrow ---");
                    sql = "insert into users (user_name, user_email, user_password, user_type, status) values (?,?,?,?.?)";
                    conn.query(sql, [data.user_name, data.user_email, data.user_password, data.user_type, "active"], this);
                }
                
            },
            function getUserId (error, result){
                if(error){
                    
                    console.log("get userid error  ");
                    conn.release();
                    return res.status(500).end();
                }
                console.log("--- inside getuserid ---", result);
                if(result != true){
                    console.log("--- inside getuserid ---", result);
                    sql = "select user_id from users where user_email = ?";
                    conn.query(sql, user_email, this);
                }
            },
            function otherTables (error, result) {
                if(error){
                    
                    console.log("other table error  ");
                    conn.release();
                    return res.status(500).end();
                }
                console.log("--- inside othertable --- ", result);
                if(user_type == 'corporateUser'){
                    var company_name = data.company_name, designation = data.designation, company_website = data.company_website,
                        contact_num = data.contact_num, address = data.address;

                    sql = "insert into corportateUsers values (?,?,?,?,?) ";
                    conn.query(sql, [result[0].user_id, company_name, designation, company_website, contact_num, address], this);    
                }else{
                    var user_address = data.user_address, user_contact = data.user_contact, user_uid = data.user_uid;
                    console.log("--- inside othertable individualUser ---", result);
                    sql = "insert into individualUsers (user_id, user_address, user_contact, user_uid) values (?,?,?,?)";
                    
                    conn.query(sql, [result[0].user_id, user_address, parseInt(user_contact,10), user_uid], this);
                }
                
            },
            function last (error, result) {
                if(error){
                    
                    console.log("last error  ");
                    conn.release();
                    return res.status(500).end();
                }
                console.log("--- last ----");
                conn.release();
                return res.status(201).end(); // 201 for created
            }
        );

    })
})

router.delete('/delete/:user_id', (req,res) => {   // when user delete its account

    pool.getConnection( (err,conn) => {

        if(err){
            conn.release();
            console.log("error  ", err);
            return res.status(500).json({
                error: err
            });
        }

        var sql = "update users set status = 'deleted' where user_id = ?";
        
        conn.query( sql, req.params.user_id, (error, results) => {
            if(error){
                conn.release();
                console.log("error  ", err);
                return res.status(500).json({
                    error: err
                });
            }

            conn.release();
            return res.status(200).end();
        })
    });

});


router.patch('/edit/:user_id/:user_type', (req, res) => {  // for edit profile

    pool.getConnection( (err,conn) => {
        if(error){
            conn.release();
            console.log("error  ", err);
            return res.status(500).end();
        }    
        var data = req.body;
        var params = req.params;

        var sql = "update users set user_name = ?, user_email = ? where user_id = ?";

        conn.query(sql, [data.user_name, data.user_email, params.user_id], (err, result) => {
            if(err){
                conn.release();
                return res.status(500).end();
            }
            var para;
            
            if(params.user_type == 'corporateUser'){
                sql = "update corporateUsers set company_name = ?, company_website = ?, designation = ?, contact_num = ?, address = ? where user_id = ?";
                para = [data.company_name, data.company_website, data.designation, data.contact_num, data.address, params.user_id];
            }else {
                sql = "update individualUsers set user_address = ?, user_contact = ?, user_uid = ? where user_id = ?";
                para = [data.user_address, data.user_contact, data.user_uid, params.user_id];
            }

            conn.query( sql, para, (err, result) => {
                if(err){
                    conn.release();
                    return res.status(500).end();
                }
                
                conn.release();
                return res.status(200).end();
            });

        });

    })

})


router.post('/checkPassword/:user_id', (req, res) => {  // when user want to update password first needs to verify it

    pool.getConnection ( (err, conn) => {
        if(err){
            conn.release();
            return res.status(500).end();
        }

        var sql = "select status from users where user_id = ? and user_password = ?";

        conn.query( sql, [req.body.user_password, req.params.user_id], (err, rows) => {
            
            conn.release();

            if(err){    
                return res.status(500).end();
            }

            if(rows.length == 0 ){
                return res.status(401).end();
            }else{
                return res.status(200).end();
            }

        });

    });

});

router.post('/editPassword/:user_id', (req, res) => {  //  when user want to edit password

    pool.getConnection ( (err, conn) => {

        if(err){
            conn.release();
            return res.status(500).end();
        }
        
        var sql = "update users set user_password = ? where user_id = ?";

        conn.query( sql, [req.body.user_password, req.params.user_id], (err, results) => {
            conn.release();

            if(err){
                return res.status(500).end();
            }

            return res.status(200).end();
        })
        
    });

})


router.get ('/info/:user_id/:user_type', (req, res) => {  // after get logged in user needs the info

    pool.getConnection ( (err,conn) => {

        if(err){
            conn.release();
            return res.status(500).end();
        }

        var sql, param = req.params;

        if ( param.user_type == 'individualUser' )
            sql = "select user_addres, user_contact, user_uid from individualUsers where user_id = ?";
        else 
            sql = "select company_name, designation, company_website, contact_num, address from corporateUsers where user_id = ?";
        
        conn.query( sql, param.user_id, (err, results) => {
            conn.release();
            if(err) {
                return res.status(500).end();
            }

            return res.status(200).json({
                results: results[0]
            });
        });    
            
    });

});


router.patch('/permit/:user_id', auth, (req, res) => { //  when admin want to unblock user

    pool.getConnection( (err, conn) => {

        if(err){
            conn.release();
            return res.status(500).end();
        }
        
        var sql = "update users set status = 'active' where user_id = ?";

        conn.query( sql, req.params.user_id, (err, result) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
});


router.patch('/block/:user_id', auth, (req, res) => { // admin can block moderator

    pool.getConnection( (err, conn) => {

        if(err){
            conn.release();
            return res.status(500).end();
        }
        
        var sql = "update users set status = 'blocked' where user_id = ?";

        conn.query( sql, req.params.user_id, (err, result) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
})


router.get('/', auth, (req, res) => { // admin can see all the users

    pool.getConnection( (err, conn) => {

        if(err){
            conn.release();
            return res.status(500).end();
        }
        
        conn.query( "select * from users", (err, results) => {
            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).json({
                users: results
            });
        }) 

    });
});



module.exports = router;