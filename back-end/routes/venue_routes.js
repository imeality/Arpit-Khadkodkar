const express = require('express');
const router = express.Router();

// const jwt = require('jsonwebtoken');
const auth = require('../utilities/auth');

const pool = require('../utilities/connection')

const venueFacilities = require('./venue_facilities');
const venueRoomLayouts = require('./venue_room_layout');
const venueTypes = require('./venue_type');

var moment = require('moment');

var utility = require('../utilities/utility');


function getVenueId (conn, moderator_id, venue_name) {

    var sql = "select venue_id from venues where moderator_id = ? and venue_name = ?";
    conn.query( sql, [moderator_id, venue_name], (err, result) => {

        if (err) {
            return err;
        }

        return result[0];
    });
}


router.get('/filters/:skipRows/:numberOfRows', (req, res) => { // user can get venues on the basis of filters
    console.log("filters inside ",);
    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            console.log("filters error ", err);
            return res.status(500).end();
        }

        var data = req.body;
        
        var sql1 = "select venues.venue_id, venues.venue_name, venues.max_capacity, venues.image, venues.ratings, venues.offers, offers.discount from"+
        " venues";

        var sql2 = " where venues.status = 'active' and venues.city=? and venues.max_capacity>?";
        var facilities, types, layouts;
        
        if ( data.present[0] != 0) {
            sql1 += " inner join venueFacilities using(venue_id)";
            facilities= utility.objectToStringOr(data.facilities, "venueFacilities.", "=");
            sql2 += " and ("+facilities+")";
        }
        

        if ( data.present[1] != 0) {
            sql1 += " inner join venueType using(venue_id)";
            types = utility.objectToStringOr(data.types, "venueType.", "=");
            sql2 += " and ("+types+")";
        }
        

        if ( data.present[2] != 0) {
            sql1 += " inner join venueRoomLayout using(venue_id)";
            layouts = utility.objectToStringOr(data.layouts, "venueRoomLayout.", ">");
            sql2 += " and ("+layouts+")";
        }
        sql1 += " left join offers using (venue_id)";
        var sql = sql1 + sql2 +" order by venues.featured desc, venues.offers desc limit "+
                parseInt(req.params.numberOfRows)+" offset "+parseInt(req.params.skipRows);
        
        conn.query( sql, [data.venues[0],data.venues[1]], (err, result) => {

            conn.release();
            if ( err ) {      
                console.log( err );         
                return res.status(500).end();
            }

            return res.status(200).json({
                data: result
            })
  
        });
    
    });
});

router.get('/count/all', (req, res) => { // admin dashboard => get all venues count/all
   // console.log("inside venues listed");
    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        } 
        
        var sql = "select count(venue_id) as sum from venues";

        conn.query( sql, (err, resl) => {

            conn.release();
            if ( err ) {
                return res.status(500).end();
            }
          //  console.log(" venues listed ",resl[0].sum);
            return res.status(200).json({
                data: resl[0].sum
            })
        })
    })
});

router.post('/add/:moderator_id', auth, (req, res) => { 

    pool.getConnection ( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        const data = req.body;
        var venueId;  //--------------

        var insertIntoVenues = new Promise ( (resolve, reject) => {
            let sql = "insert into venues (moderator_id, venue_name, image, city, state, country, address, max_capacity, status, ratings, total_bookings, featured, offers, booking_type) values (?,?,?,?,?,?,?,?,'active',0,0,0,0,?)"
            conn.query( sql, data.venues, (err, results) => {

                console.log("---- inside insertIntoVenues   -----");
                if (err) {
                    reject(err);
                } else {
                     venueId = getVenueId(conn, data.venues[0], data.venues[1]);
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
            Promise.race([insertInotVenueFacilities, insertInotVenueType, insertInotVenueRoomLayout]).then( (values) => {
                console.log("-- values -- ", values);
                conn.release();
                return res.status(200).end();
            })
        }, function(error){
            console.log("=== error === ", error);
            conn.release();
            return res.status(500).end();
        })
    });
});

router.get('/venueIds/:moderator_id', auth, (req, res) => { // return all venue id and name of particular moderator

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

router.get('/all/:venue_id', (req, res) => {  // get all information of a venue through its id

    pool.getConnection( ( err, conn ) => {
       
        if ( err ) {
            conn.release();
            console.log(" pool error => ",err);
            return res.status(500).end();
        }

        var sql = "select venues.venue_name, venues.image, venues.city, venues.state, venues.country, venues.address, venues.max_capacity, venues.status," +
        " venues.ratings, venues.total_bookings, venues.booking_type, venueFacilities.gym, venueFacilities.bar, venueFacilities.restaurant as facilityRestaurant, venueFacilities.parking,"+
        " venueFacilities.wifi, venueFacilities.disabled_facility, venueFacilities.bedroom, venueFacilities.laundry, venueFacilities.av_technician, venueFacilities.others as facilityOthers,"+
        " venueRoomLayout.banquet, venueRoomLayout.u_shape, venueRoomLayout.boardroom, venueRoomLayout.theatre, venueRoomLayout.classroom, venueRoomLayout.reception,"+
        " venueRoomLayout.cabaret, venueType.hotel, venueType.conference_centre, venueType.sports, venueType.academic, venueType.cultural, venueType.bussiness_centre,"+
        " venueType.pub, venueType.restaurant as typeRestaurant from venues inner join venueFacilities using(venue_id) inner join venueType using(venue_id)"+
        "  inner join venueRoomLayout using(venue_id) where venue_id = ? and (venues.status = 'active' or venues.status = 'halt' ) "; 

        conn.query( sql, req.params.venue_id, (err, results) => {
            
            conn.release();
            if (err) {
                console.log(" error => ",err);
                return res.status(500).end();
            }
            // console.log(" sql => ", sql);
            //console.log(" result => ", results);
            return res.status(200).json({
                data: results
            });
        })
    });
});

router.patch('/edit/:venue_id', (req, res) => { // edit venue details  
    console.log("the problem is not here");
    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        }

        var venueId = req.params.venue_id;
        var data = req.body;
        var editVenueInfo = new Promise( (resolve, reject) => {

            var sql = "update venues set ? where venue_id = ?";
            conn.query( sql, [data.venues, venueId], (err, result) => {
                
                    if (err) {
                        reject(err);
                    } else {
                        resolve('success');
                    }
            });
        });
        console.log("facilities ",data.facilities);
        var editVenueFacilities = new Promise( (resolve, reject) => {

            var value = venueFacilities.editVenueFacilities(data.facilities, venueId, conn);

            if (value == 'error') {
                reject(err);
            } else {
                resolve('success');
            }
        });

        var editVenueTypes = new Promise( (resolve, reject) => {

            var value = venueTypes.editVenueTypes(data.types, venueId, conn);

            if ( value == 'error') {
                reject(err);
            } else {
                resolve('success');
            }
        });

        var editVenuelayouts = new Promise( (resolve, reject) => {

            var value = venueRoomLayouts.editRoomLayouts(data.layouts, venueId, conn);

            if ( value == 'error') {
                reject(err);
            } else {
                resolve('success');
            }
        });

        Promise.all([editVenueInfo, editVenueFacilities, editVenueTypes, editVenuelayouts])
        .then( values => {
            conn.release();
            console.log('----- values ------   ', values);
            return res.status(200).end();
        })
        .catch( error => {
            conn.release();
            console.log(" error handled ", error);
            return res.status(500).json({
                error: error
            });
        })
    })
});

router.delete('/delete/:venueId', (req, res) => {  // moderator can delete venues
    
    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            console.log(" pool error ", err);
            return res.status(500).end();
        }

        conn.query("update venues set status = 'deleted' where venue_id = ?", req.params.venueId, (err, result) => {
         
            if ( err ) {
                conn.release();
                console.log(" venue delete err ", err)
                return res.status(500).end();
            }

            conn.query("update subVenues set status = 'deleted' where venue_id = ?", req.params.venueId, (err, result) => {

                conn.release();
                if ( err ) {
                    console.log(" sub venue delete err ", err)
                    return res.status(500).end();
                }

                return res.status(200).json({data: result});
            })
        })

    });
});

router.patch('/halt/:venue_id', (req, res) => { //  halt venue
    console.log("problem is not here ");
    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            
            return res.status(500).end();
        }
        
        conn.query("update venues set status = 'halt' where venue_id = ?", req.params.venue_id, (err, result) => {
         
            if ( err ) {
                conn.release();
                return res.status(500).end();
            }

            conn.query("update subVenues set status = 'halt' where venue_id = ?", req.params.venue_id, (err, result) => {

                conn.release();
                if ( err ) {
                    return res.status(500).end();
                }

                return res.status(200).end();
            })
        })

    });
});

router.patch('/unHalt/:venue_id', (req, res) => { // remove halt venue

    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        }
        
        conn.query("update venues set status = 'active' where venue_id = ?", req.params.venue_id, (err, result) => {
         
            if ( err ) {
                conn.release();
                return res.status(500).end();
            }

            conn.query("update subVenues set status = 'active' where venue_id = ?", req.params.venue_id, (err, result) => {

                conn.release();
                if ( err ) {
                    return res.status(500).end();
                }

                return res.status(200).end();
            })
        })

    });
}); 

router.get('/:city/:capacity', (req, res) => { // user search through search bar

    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        }
        
        var sql = "select venue_id, venue_name, max_capacity, image, ratings, offers from venues where city = ? and status = 'active' and max_capacity >= ? order by featured desc, offers desc";

        conn.query( sql, [req.params.city, req.params.capacity], (err, results) => {

            conn.release();
            if ( err ) {
                return res.status(500).end();
            }

            return res.status(200).json({
                data: results
            })
        })
    })
});

module.exports = router;