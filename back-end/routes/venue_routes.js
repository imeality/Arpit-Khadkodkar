const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const auth = require('../utilities/auth');

const pool = require('../utilities/connection')

const venueFacilities = require('./venue_facilities');
const venueRoomLayouts = require('./venue_room_layout');
const venueTypes = require('./venue_type');


function getVenueId (conn, moderator_id, venue_name) {

    var sql = "select venue_id from venues where moderator_id = ? and venue_name = ?";
    conn.query( sql, [moderator_id, venue_name], (err, result) => {

        if (err) {
            return err;
        }

        return result[0];
    });
}


// Moderator api -------


// add venue --  
// 1. insert in venues
// 2. get venue_id from venues
// 3. insert into venueFacilities, venueTypes and VenueRoomLayouts

router.post('/add/:moderator_id', auth, (req, res) => { 

    pool.getConnection ( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        const data = req.body.data, venueId;  //--------------

        var insertIntoVenues = new Promise ( (resolve, reject) => {
            let sql = "insert into venues (moderator_id, venue_name, image, city, state, country, address, max_capacity, status, ratings, total_bookings, featured, offers, booking_type) values (?,?,?,?,?,?,?,?,'active',0,0,0,0,?)"
            conn.query( sql, data.venues, (err, results) => {

                console.log("---- inside insertIntoVenues   -----");
                if (err) {
                    reject(err);
                } else {
                     venueId = getVenueId(conn, data.moderator_id, data.venue_name);
                     resolve(venueId);
                }
            })
        });

        var insertInotVenueFacilities = new Promise ( (resolve, reject) => {

            var result = venueFacilities.addVenueFacilities(venueId, data.facilities, conn);
            console.log("---- inside insertIntoVenueFacilities   -----   result  =>  ", result);
            if (result) {
                reject('error');
            } else {
                resolve('success');
            }
        });

        var insertInotVenueType = new Promise ( (resolve, reject) => {

            var result = venueTypes.addVenuTypes( venueId, data.types, conn);
            console.log("---- inside insertIntoVenueType   -----   result  =>  ", result);
            if (result) {
                reject('error');
            } else {
                resolve('success');
            }
        });

        var insertInotVenueRoomLayout = new Promise ( (resolve, reject) => {

            var result = venueRoomLayouts.addRoomLayouts( venueId, data.layouts, conn);
            console.log("---- inside insertIntoVenueRoomLayout   -----   result  =>  ", result);
            if (result) {
                reject('error');
            } else {
                resolve('success');
            }
        });

        insertIntoVenues
        .then( function(venueId){
            Promise.all([insertInotVenueFacilities, insertInotVenueType, insertInotVenueRoomLayout]).then( (values) => {
                console.log("-- values -- ", values);
                conn.release();
            })
        }, function(error){
            console.log("=== error === ", error);
            conn.release();
        })

        setTimeout( () => {
            return res.status(200).end();
        }, 300)
    });
});


router.get('/names/:moderator_id', auth, (req, res) => { // return all venue id and name of particular moderator

    pool.getConnection ( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "select venue_id, venue_name from venues where moderator_id = ? and (status = 'halt' or status = 'active')";
        conn.query( sql, req.params.moderator_id, (err, results) => {

            conn.release();
            if (err) 
                return res.status(500).end();
            
            return res.status(200).json({
                data: results
            });
        });
    });
});


router.get('/:venue_id', auth, (req, res) => {  // get all information of a venue through its id

    pool.getConnection( ( err, conn ) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        }
        var venueId = req.params.venue_id;

        var sql = "select venues.venue_name, venues.image, venues.city, venues.state, venues.country, venues.address, venues.max_capacity, venues.status," +
        " venues.ratings, venues.total_bookings, venues.booking_type, venueFacilities.gym, venueFacilities.bar, venueFacilities.restaurant, venueFacilities.parking,"+
        " venueFacilities.wifi, venueFacilities.disabled_facility, venueFacilities.bedroom, venueFacilities.laundry, venueFacilities.av_technician, venueFacilities.others,"+
        " venueRoomLayout.banquet, venueRoomLayout.u_shape, venueRoomLayout.boardroom, venueRoomLayout.theatre, venueRoomLayout.classroom, venueRoomLayout.reception,"+
        " venueRoomLayout.cabaret, venueType.hotel, venueType.conference_centre, venueType.sports, venueType.academic, venueType.cultural, venueType.business_centre,"+
        " venueType.pub, venueType.restaurant from venues inner join venueFacilities on venues.venue_id = venueFacilities.venue_id inner join venueType on venues.venue_id"+
        " = venueType.venue_id inner join venueRoomLayout on venues.venue_id = venueRoomLayout.venue_id where (venues.status = 'active' or venues.status = 'halt')";

        conn.query( sql, (err, results) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).json({
                data: results[0]
            })
        })
    });
});


router.patch('/edit/:venue_id', (req, res) => { // edit venue details  --- incompleted   ---

    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        }

        var venueId = req.params.venue_id;
        var data = req.body;
        var editVenueInfo = new Promise( (resolve, reject) => {

            conn.query(
                "update venues set venue_name=?, venue_image=?, city=?, state=?, country=?, address=?, max_capacity=?, booking_type=? where venue_id = ?",
                venueId,
                (err, result) => {
                    if (err) {
                        reject(false);
                    } else {
                        resolve(true);
                    }
                });
        });
    })
});


module.exports = router;