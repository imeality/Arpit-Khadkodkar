const pool = require('../utilities/connection');

function addVenuTypes (venueType) { // moderator add venue type

    pool.getConnection( (err, conn) => {

        if (err) {  
            conn.release();
            return 'error';
        }

        conn.query("insert into venueType values (?,?,?,?,?,?,?,?,?)", venueType, (err, results) => {
            conn.release();

            if (err) {
                return 'error';
            }

            return 'success';
        });
    }); 
}

function getVenueTypes (venue_id) { // when retrieving information of venues, call this for a particular venue

    pool.getConnection( (err, conn) => {

        if (err) {  
            conn.release();
            return 'error';
        }

        conn.query("select * from venueType where venue_id = ?", venue_id, (err, results) => {
            conn.release();

            if (err) {
                return 'error';
            }

            return results[0];
        })
    })
}


function editVenueTypes (venue_id, types) { // moderator can edit venue type

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }

        var sql = "update venueType set hotel=?, conference_centre=?, sports=?, academic=?, cultural=?, bussiness_centre=?, pub=?, restaurant=? where venue_id=?";

        conn.query(sql, [types, venue_id], (err, result) => {

            conn.release();
            if (err) {
                return 'error';
            }

            return 'success';
        });
    });
}

function getVenueIds (types) { // filter to get all venues for particular venue types

    pool.getConnection ( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }
        
        var sql = "select venue_id from venuesTypes where hotel=? or conference_centre=? or sports=? or academic=? or cultural=? or bussiness_centre=? or pub=? or restaurant=?";

        conn.query( sql, types, (err, results) => {
            conn.release();
            if (err) {
                return 'error';
            }

            return {
                venueIds: results
            };
        })
    })
}

module.exports = {
    getVenueTypes: getVenueTypes,
    editVenueTypes: editVenueTypes,
    getVenueIds: getVenueIds,
    addVenuTypes: addVenuTypes,
}