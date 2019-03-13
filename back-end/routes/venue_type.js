
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



module.exports = {
    getVenueTypes: getVenueTypes,
    editVenueTypes: editVenueTypes,
    addVenuTypes: addVenuTypes,
}