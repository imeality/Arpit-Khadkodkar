const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const auth = require('../utilities/auth');

const pool = require('../utilities/connection')

router.post('/add/:moderator_id', auth, (req, res) => { // moderator can add

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var data = req.body;
        var sql = "insert into venues (moderator_id, venue_name, image, city, state, country, address, max_capacity, status, ratings, totalBookings, featured, offers, bookingType) values (?,?,?,?,?,?,?,?,'available',0,0,0,0,?)";
        
        conn.query( sql, [req.params.moderator_id, data.venue_name, data.image, data.city, data.state, data.country, data.address, data.max_capacity, data.bookingType], (err, result) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }
            sql = "select venue_id from venues where moderator_id = ? and venue_name = ?";

            conn.query(sql, [req.params.moderator_id, data.venue_name], (err, result) => {
                conn.release();
                if (err) {
                    return res.status(500).end();
                }
                return res.status(200).json({
                    venue_id: result[0].venue_id
                })
            }) 
        });
    });
});


router.get('/', auth, (req,res) => { // get all venues, will call when user get logged in

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }
        
        conn.query("select * from venues where moderator_id = ?", req.params.moderator_id, (err, results) => {
            
            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).json({
                venues: results
            })
        });
    });
});



router.patch('/edit', auth, (req,res) => { // moderator can edit venue details

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var data = req.body;
        var sql = "update venues set venue_name=?, image=?, city=?, state=?, country=?, address=?, max_capacity=?. bookingType=? where venue_id =?";
        
        conn.query( sql, [data.venue_name, data.image, data.city, data.state, data.country, data.address, data.max_capacity, data.bookingType], (err, result) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).end(); 
        });
    });
});


router.patch('/delete/:venue_id', auth, (req,res) => {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        conn.query("update venues set staus = 'deleted' where venue_id = ?", req.params.venue_id, (err, result) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
});



module.exports = router;