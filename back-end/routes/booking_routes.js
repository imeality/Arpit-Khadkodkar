var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var auth = require('../utilities/auth');
var pool = require('../utilities/connection');


router.post('/add/:user_id/:sv_id', auth, (req, res) => { // user add booking
    
    pool.getConnection( (err, conn) => {

        var sql = "select venue_id, moderator_id from subVenues where sv_id = ?";

        conn.query( sql, req.params.sv_id, (err, results) => {
            if(err){
                conn.release();
                return res.status(500).end();
            }

            sql = "insert into bookings (venue_id, sv_id, moderator_id, user_id, amount, date, status) values (?,?,?,?,?,?,?)";

            conn.query( 
                sql, 
                [results[0].venue_id, req.params.sv_id, results[0].moderator_id, req.params.user_id, req.body.amount, req.body.date, "confirmed"], 
                (err, results) =>{
                    conn.release();
                    if(err){
                        return res.status(500).end();
                    }
                    return res.status(200).end();
                }
            );
        });

    });

});


// router.get('/',  (req, res) => {

//     pool.getConnection( (err, conn) => {
        
//         if (err) {
//             conn.release();
//             return res.status(500).end();
//         }
//         console.log(req.body);
//         conn.query( " select * from bookings where ?", req.body, (err, results) => {
//             conn.release();
            
//             if(err) {
//                 console.log(err)
//                 return res.status(500).end();
//             }
//             console.log("result ", results);
//             return res.status(200).json({
//                 data: results
//             });
        
//         });
//     });
// })


router.get('/', auth, (req, res) => { // get booking for any kind

    var sql = "select * from bookings where ";
    var added = false;
    
    var moderator_id = req.body.moderator_id, user_id = req.body.user_id, venue_id = req.body.venue_id, sv_id = req.body.sv_id;

    if(moderator_id != 0){
        sql = sql + " moderator_id = " + moderator_id + "";
        added = true;
        console.log("--- 1 ---");
    }

    if(user_id != 0){
        console.log("--- 2 ---");
        if(added){
            sql = sql + " and user_id = "+user_id+"";
        }else {
            added = true;
            sql = sql + " user_id = "+user_id+"";
        }
    }

    if(venue_id != 0){
        console.log("--- 3 ---");
        if(added){
            sql = sql + " and venue_id = "+venue_id+"";
        }else {
            added = true;
            sql = sql + " venue_id = "+venue_id+"";
        }
    }

    if(sv_id != 0){
        console.log("--- 4 ---");
        if(added){
            sql = sql + " and sv_id = "+sv_id+"";
        }else {
            added = true;
            sql = sql + " sv_id = "+sv_id+"";
        }
    }

    if(req.body.status != 0){
        var co=false, bo=false;
        console.log("--- 5 ---");
        if(added){
            
            sql = sql + " and ( status = '";

            
        }else {
            added = true;
            sql = sql + " ( status = '";
        }

        if(req.body.completed != 0){
            console.log("--- a ---");
           sql = sql + "completed'";
           co = true;
        }
        if(req.body.booked != 0){
            console.log("--- b ---");
            bo = true;
            if(co){
                sql = sql + " or status = 'booked'";
            }else{
                sql = sql + "booked'";
            }
        }
        if(req.body.cancelled != 0){
            console.log("--- c ---");
            if(co || bo){
                sql = sql + " or status = 'cancelled'";
            }else{
                sql = sql + "cancelled'";
            }
        }

        sql = sql + " )";
    }

    conn.query( sql, (err, results) => {
        conn.release();

        if(err) {
            return res.status(500).end();
        }

        return res.status(200).json({
            data: results
        });
    
    });

});


router.patch('/cancel/:booking_id', auth, (req, res) => {

    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "update bookings set status = 'cancelled' where booking_id = ?";
        conn.query( sql, req.params.booking_id, (err, result) => {

            conn.release();
            if ( err ) {
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
});



module.exports = router;