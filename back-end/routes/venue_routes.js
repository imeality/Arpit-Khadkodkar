const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const auth = require('../utilities/auth');

const pool = require('../utilities/connection')

router.post('/add/:moderator_id', auth, (req, res) => {

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


router.



module.exports = router;