var router = require('express').Router();
var auth = require('../utilities/auth');
var pool = require('../utilities/connection');

const subVenueFacilities = require('./sv_facilities');
const subVenueRoomLayouts = require('./sv_room_layout');

function getSubVenueId (conn, venue_id, sv_name) {

    var sql = "select sv_id from subVenues where venue_id = ? and sv_name = ?";
    conn.query( sql, [venue_id, sv_name], (err, result) => {

        if (err) {
            return err;
        }

        return result[0];
    });
}

// moderators

router.post('/add/:venue_id/:moderator_id', auth, (req, res) => { 

    pool.getConnection ( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        const data = req.body, svId;  //--------------

        var insertIntoSubVenues = new Promise ( (resolve, reject) => {
            let sql = "insert into subVenues (venue_id, moderator_id, sv_name, sv_images, opening_time, closing_time, status, ratings, total_bookings, about) values (?,?,?,?,?,?,'active',0,0,?)"
            conn.query( sql, [req.params.venue_id, req.params.moderator_id, data.sv_name, data.sv_images, data.opening_time, data.closing_time, data.about], (err, results) => {

                console.log("---- inside insertIntoVenues   -----");
                if (err) {
                    reject(err);
                } else {
                     svId = getSubVenueId(conn, req.params.venue_id, data.sv_name);
                     resolve(svId);
                }
            })
        }); 

        var insertIntoSubVenueFacilities = new Promise ( (resolve, reject) => {
            
            var facilities = [data.projector_screen, data.projector, data.tv, data.microphone, data.facilityOthers];

            var result = subVenueFacilities.addSubVenueFacilities(svId, facilities, conn);
            console.log("---- inside insertIntoVenueFacilities   -----   result  =>  ", result);
            if (result) {
                reject('error');
            } else {
                resolve('success');
            }
        });

        var insertIntoSubVenueRoomLayout = new Promise ( (resolve, reject) => {

            var layouts = [data.banquet, data.u_shape, data.boardroom, data.theatre, data.classroom, data.reception, data.cabaret];

            var result = subVenueRoomLayouts.addSubVenueLayouts( svId, layouts, conn);
            console.log("---- inside insertIntoVenueRoomLayout   -----   result  =>  ", result);
            if (result) {
                reject('error');
            } else {
                resolve('success');
            }
        });

        insertIntoSubVenues
        .then( function(venueId){
            Promise.all([insertIntoSubVenueFacilities, insertIntoSubVenueRoomLayout]).then( (values) => {
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


router.patch('/edit/:sv_id', auth, (req, res) => { // edit

    pool.getConnection ( (err, conn) => {

        if (err) {
            conn.release();
            return res.status(500).end();
        }

        const data = req.body, svId = req.params.sv_id;  //--------------

        var editIntoSubVenues = new Promise ( (resolve, reject) => {
            let sql = "update subVenues set sv_name=?, opening_time=?, closing_time=?, about=?) values (?,?,?,?)"
            conn.query( sql, [svId, data.sv_name, data.opening_time, data.closing_time, data.about], (err, results) => {

                console.log("---- inside editIntoVenues   -----");
                if (err) {
                    reject(err);
                } else {
                     
                     resolve('success');
                }
            })
        }); 

        var editIntoSubVenueFacilities = new Promise ( (resolve, reject) => {
            
            var facilities = [data.projector_screen, data.projector, data.tv, data.microphone, data.facilityOthers];

            var result = subVenueFacilities.editSubVenueFacilities(facilities,svId, conn);
            console.log("---- inside insertIntoVenueFacilities   -----   result  =>  ", result);
            if (result == 'error') {
                reject('error');
            } else {
                resolve('success');
            }
        });

        var editIntoSubVenueRoomLayout = new Promise ( (resolve, reject) => {

            var layouts = [data.banquet, data.u_shape, data.boardroom, data.theatre, data.classroom, data.reception, data.cabaret];

            var result = subVenueRoomLayouts.editSubVenueLayouts( layouts, svId, conn);
            console.log("---- inside insertIntoVenueRoomLayout   -----   result  =>  ", result);
            if (result == 'error') {
                reject('error');
            } else {
                resolve('success');
            }
        });

        
            Promise.race([editIntoSubVenues, editIntoSubVenueFacilities, editIntoSubVenueRoomLayout]).then( (values) => {
                console.log("-- values -- ", values);
                conn.release();
                return res.status(200).end();
            })
      
    });
});


router.delete('/delete/:svId', auth, (req, res) => {  // moderator can delete venues

    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        }

        conn.query("update subVenues set status = 'deleted' where sv_id = ?", req.params.svId, (err, result) => {

            conn.release();
            if ( err ) {
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
})


router.get('/moderatorSearch/:venue_id', auth, (req, res) => { // get all sub venues of a particular venue

    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "select subVenues.sv_id, subVenues.sv_name, subVenues.sv_images, subVenues.opening_time, subVenues.closing_time, subVenues.status, subVenues.ratings,"+
        " subVenues.total_bookings, subVenues.about, subVenuesFacilities.projector_screen, subVenuesFacilities.projector, subVenuesFacilities.tv,"+
        " subVenuesFacilities.microphone, subVenuesFacilities.others, svRoomLayout.banquet, svRoomLayout.u_shape, svRoomLayout.boardroom, svRoomLayout.theatre,"+
        " svRoomLayout.classroom, svRoomLayout.reception, svRoomLayout.cabaret from subVenues inner join subVenuesFacilities using(sv_id) inner join"+
        " svRoomLayout using(sv_id) where subVenues.venue_id = ? and (subVenues.status = 'active' or subVenues.status = 'halt') ";

        conn.query( sql, req.params.venue_id, (err, results) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).json({
                data: results
            });
        });
    });
});


router.patch('/halt/:sv_id', (req,res) => { // halt

    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        }

        conn.query("update subVenues set status = 'halt' where sv_id =? ", req.params.sv_id, (err, result) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).end()
        });
    });
});


router.patch('/unHalt/:sv_id', (req,res) => { // remove halt

    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        }

        conn.query("update subVenues set status = 'active' where sv_id =? ", req.params.sv_id, (err, result) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).end()
        });
    });
});


router.get('/userSearch/:venue_id', auth, (req, res) => { // get all sub venues of a particular venue

    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "select subVenues.sv_id, subVenues.sv_name, subVenues.sv_images, subVenues.opening_time, subVenues.closing_time, subVenues.ratings,"+
        " subVenues.total_bookings, subVenues.about, subVenuesFacilities.projector_screen, subVenuesFacilities.projector, subVenuesFacilities.tv,"+
        " subVenuesFacilities.microphone, subVenuesFacilities.others, svRoomLayout.banquet, svRoomLayout.u_shape, svRoomLayout.boardroom, svRoomLayout.theatre,"+
        " svRoomLayout.classroom, svRoomLayout.reception, svRoomLayout.cabaret from subVenues inner join subVenuesFacilities using(sv_id) inner join"+
        " svRoomLayout using(sv_id) where subVenues.venue_id = ? and subVenues.status = 'active' ";

        conn.query( sql, req.params.venue_id, (err, results) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).json({
                data: results
            });
        });
    });
});


router.get('/:sv_id', auth, (req, res) => { // get all sub venues of a particular venue

    pool.getConnection( (err, conn) => {

        if ( err ) {
            conn.release();
            return res.status(500).end();
        }

        var sql = "select subVenues.sv_id, subVenues.sv_name, subVenues.sv_images, subVenues.opening_time, subVenues.closing_time, subVenues.ratings,"+
        " subVenues.total_bookings, subVenues.about, subVenuesFacilities.projector_screen, subVenuesFacilities.projector, subVenuesFacilities.tv,"+
        " subVenuesFacilities.microphone, subVenuesFacilities.others, svRoomLayout.banquet, svRoomLayout.u_shape, svRoomLayout.boardroom, svRoomLayout.theatre,"+
        " svRoomLayout.classroom, svRoomLayout.reception, svRoomLayout.cabaret from subVenues inner join subVenuesFacilities using(sv_id) inner join"+
        " svRoomLayout using(sv_id) where subVenues.sv_id = ? and not subVenues.status = 'deleted' ";

        conn.query( sql, req.params.sv_id, (err, results) => {

            conn.release();
            if (err) {
                return res.status(500).end();
            }

            return res.status(200).json({
                data: results
            });
        });
    });
});


module.exports = router;