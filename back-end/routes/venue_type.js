
function addVenuTypes (venueId, venueType, conn) { // moderator add venue type

    conn.query("insert into venueType values (?,?,?,?,?,?,?,?,?)", [venueId, venueType], (err, results) => {

        if (err) {
            return false;
        }

        return true;
    });
}

function getVenueTypes (venue_id, conn) { // when retrieving information of venues, call this for a particular venue


    conn.query("select * from venueType where venue_id = ?", venue_id, (err, results) => {
    
        if (err) {
            return 'error';
        }

        return results[0];
    })

}


function editVenueTypes (types, conn) { // moderator can edit venue type

    var sql = "update venueType set hotel=?, conference_centre=?, sports=?, academic=?, cultural=?, bussiness_centre=?, pub=?, restaurant=? where venue_id=?";

    conn.query(sql, [types, venue_id], (err, result) => {

        if (err) {
            return 'error';
        }

        return 'success';
    });
   
}

function getVenueIds (types, conn) { // filter to get all venues for particular venue types
    
    var sql = "select venue_id from venuesTypes where hotel=? or conference_centre=? or sports=? or academic=? or cultural=? or bussiness_centre=? or pub=? or restaurant=?";

    conn.query( sql, types, (err, results) => {
        
        if (err) {
            return 'error';
        }

        return results;
    })
}

module.exports = {
    getVenueTypes: getVenueTypes,
    editVenueTypes: editVenueTypes,
    getVenueIds: getVenueIds,
    addVenuTypes: addVenuTypes,
}