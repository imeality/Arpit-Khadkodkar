const router = require('express').Router();

const jwt = require('jsonwebtoken');
const auth = require('../utilities/auth');

var pool = require('../utilities/connection');
var Promise = require('promise');
var moment = require('moment');

var date = require('../utilities/date');

router.post('/login', (req, res) => {  // for login
    
    pool.getConnection((err, conn) => {

        if(err){
            console.log("login connection error:  ", err);
            conn.release();
            return  res.status(500).end();
        }
 
        //console.log("we get --> ",req.body);

        var data = req.body;
        var email = data.user_email, pass = data.user_password;
        var sql = "select user_id, user_name, user_type, status from users where user_email = ? and user_password = ?";
        
        conn.query(sql, [ email, pass ], function(err, result) {
            
            if(err){
                conn.release();
                return res.status(500).end();
            }   

            var len = result.length;
            
            if (len == 0) {
                conn.release();
                return res.status(401).json({
                    status: 'not exists'
                });
            }
            
            if (len == 1) {
                
                if ( result[0].status == 'active' ) {

                    //console.log("--select--", result);
                    var date = moment().format('LLL');
                    conn.query("update users set last_logged_in =? where user_id =?",[date, result[0].user_id],(err, results) => {

                        conn.release();
                        if (err) {
                            return res.status(500).end();
                        }
                        
                        //console.log("--update--", results);
                        const token = jwt.sign(
                            {                
                                email: email
                            },
                            'Just-use-this-string-as-secret',
                            {
                                expiresIn: '2hr'
                            }
                        )
                        return res.status(200).json({
                    
                            user_id: result[0].user_id,
                            user_type: result[0].user_type,
                            user_name: result[0].user_name,
                            token: token
                        })
                    });


                } else {
                    conn.release();
                    return res.status(401).json({
                        status: 'blocked'
                    })
                }
            }
        });     
    })
})

// registration :-
// 1. check email exist or not
// 2. check rows.length 
// 3. insert into users
// 4. get user_id from users
// 5. insert into user type table

router.post('/registration', (req,res) => {  // for registration
    
    pool.getConnection((err, conn) => {
        
        if ( err ) {
            conn.release();
            return res.status(500).end();
        }
        
        console.log(" --- in registration  ----");
        var data = req.body;

        function checkEmail() {  
            return new Promise ( (resolve, reject) => {
                console.log("----  in checkEmail ----- ")
                conn.query("select status from users where user_email = ? and not user_password = ''", data.user_email, (err, result) => {
    
                    if (err) {
                        reject('error')
                        console.log("----  in checkEmail Error ----- ",err);
                    } else {
                        if ( result.length > 0) {
                            reject('email exist')
                            console.log("----  in checkEmail Error email ----- ")
                        } else {
                            resolve('success')
                            console.log("----  in checkEmail Success ----- ", result)
                        }
                    }
                });
            });
        }

        function insertIntoUsers() {
            return new Promise ( (resolve, reject) => {
                console.log("----  in insertIntoUsers ----- ")
                var sql = "insert into users (user_name, user_email, user_password, user_type, status, sign_up_date, last_logged_in) values (?,?,?,?,'active',?,?)";
                
                var date = moment().format('LLL');
                conn.query( sql, [data.user_name, data.user_email, data.user_password, data.user_type, date, date], (err, result) => {
    
                    if (err) {
                        reject('error');
                        console.log("----  in insertIntoUsers Error ----- ", err)
                    } else {
                        console.log("----  in insertIntoUsers success ----- ", result);
                        resolve (result.insertId);
                        
                    }
                });
            });
        }  

        function lastCall(userId) {
            return new Promise ( (resolve, reject) => {
                console.log("----  in lastCall ----- ")
                if ( data.user_type == 'individualUser' ){
                    conn.query("insert into individualUsers values (?,?,?,?)", [userId, data.user_address, data.user_contact, data.user_uid], (err, result) => {
                        
                        if (err) {
                            reject('error');
                        } else {
                            console.log("--->  ", result);
                            return res.status(201).end(); // 201 created
                        }
                    })
                } else {
                    conn.query("insert into corporateUsers values (?,?,?,?,?,?)", [userId, data.company_name, data.designation, data.company_website, data.contact_num, data.address], (err, result) => {
                        
                        if (err) {
                            reject('error');
                        } else {
                            return res.status(201).end(); // 201 created
                        }
                    })
                }
            })
        }

        checkEmail()
        .then( () => insertIntoUsers())  // () => { return insertIntousers(); }
        .then( (userId) => lastCall(userId))
        .catch( error => {
            if (error == 'error') {
                return res.status(500).end();
            } else {
                return res.status(409).end(); // 409 conflict
            }
        })
    });
});


router.delete('/delete/:user_id', (req,res) => {   // when user delete its account

    pool.getConnection( (err,conn) => {

        if(err){
            conn.release();
            console.log("error  ", err);
            return res.status(500).json({
                error: err
            });
        }

        var sql = "update users set status = 'deleted' and password = '' where user_id = ?";
        
        conn.query( sql, req.params.user_id, (error, results) => {
            
            conn.release();
            if(error){
                
                console.log("error  ", err);
                return res.status(500).json({
                    error: err
                });
            }

            
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
            sql = "select user_address, user_contact, user_uid from individualUsers where user_id = ?";
        else 
            sql = "select company_name, designation, company_website, contact_num, address from corporateUsers where user_id = ?";
        
        conn.query( sql, param.user_id, (err, results) => {
            conn.release();
            if(err) {
                return res.status(500).end();
            }

            return res.status(200).json({
                data: results[0]
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


router.patch('/block/:user_id', auth, (req, res) => { // admin can block user

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
                data: results
            });
        }) 

    });
});


router.get('/:status', auth, (req, res) => { // admin can get user on the basis of status

    pool.getConnection( (err, conn) => {

        if(err){
            conn.release();
            return res.status(500).end();
        }
        var sql = "select users.user_id, user_name, user_email, user_password, user_type, user_address, user_contact, user_uid from users inner join individualUsers on users.user_id = individualUsers.user_id where users.status = ?";
        conn.query( sql, req.params.status, (err, results) => {
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


router.get('/:user_type', auth, (req, res) => { // admin can get user on the basis of user_type

    pool.getConnection( (err, conn) => {

        if(err){
            conn.release();
            return res.status(500).end();
        }
        var sql;
        if ( req.params.user_type == 'individualUser' ) {

            sql = "select users.user_id, user_name, user_email, user_password, status, user_address, user_contact, user_uid from users inner join individualUsers on users.user_id = individualUsers.user_id"; 
        } else {
            sql = "select users.user_id, user_name, user_email, user_password, status, company_name, designation, company_website, contact_num, address from users inner join corporateUsers on users.user_id = corporateUsers.user_id";
        }

        conn.query ( sql, (err, results) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).json({
                data: results
            })
        });
    });
})



router.get('/count/newUsers', auth, (req, res) => { // admin dashboard => new users in yesterday

    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        }

        var str = date.yesterdayDate();
 
        var sql = "select count(user_id) as sum from users where status = 'active' and sign_up_date like '"+str+"%' ";
        conn.query( sql, (err, result) => {

            conn.release();
            if ( err ) {
                return res.status(500).end();
            }
            console.log(" count new users => ", result);
            return res.status(200).json({
                data: result[0].sum
            });
        })
    });
})


// router.get('/count/average', auth, (req, res) => { // admin dashboard to calculate growth
    
//     pool.getConnection( (err, conn) => {

//         if ( err ) {
//             conn.release();
//             return res.status(500).end();
//         }

//         var date = moment.subtract(1, 'days');
//         date = date.split(" ");

//         var str = ""+date[0]+" "+date[1]+" "+date[2];

//         var sql = "select avg(sum) from (select count(user_id) as sum from users where status = 'active' group by date like '"+str+"%') as average ";
//         conn.query( sql, (err, result) => {

//             conn.release();
//             if ( err ) {
//                 return res.status(500).end();
//             }

//             return res.status(200).json({
//                 data: result
//             });
//         })
//     });
// })


module.exports = router;