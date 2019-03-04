
function addVenueFacilities (venueId, venueFacilities, conn) {

    conn.query("insert into venueFacilities values (?,?,?,?,?,?,?,?,?,?,?)", [venueId, venueFacilities], (err, results) => {

        if (err) {
            return false;
        }

        return true;
    });
}

function getVenueFacilities (venue_id, conn) {

    conn.query("select * from venueFacilities where venue_id = ?", venue_id, (err, results) => {

        if (err) {
            return 'error';
        }

        return results[0];
    })    
}


function editVenueFacilities (facilities, conn) {

    var sql = "update venueFacilities set gym=?, bar=?, restaurant=?, parking=?, wifi=?, disabled_facility=?, bedroom=?, laundry=?, avTechnician=? others=? where venue_id = ?";

    conn.query(sql, facilities, (err, result) => {

        if (err) {
            return 'error';
        }

        return 'success';
    });
}

function getVenueIds (facilities, conn) {
 
    var sql = "select venue_id from venuesFacilities where gym=? or bar=? or restaurant=? or parking=? or wifi=? or disabled_facility=? or bedroom=? or laundry=? or avTechnician=?";

    conn.query( sql, facilities, (err, results) => {
        
        if (err) {
            return 'error';
        }

        return results;
    })
}

module.exports = {
    addVenueFacilities: addVenueFacilities,
    getVenueFacilities: getVenueFacilities,
    editVenueFacilities: editVenueFacilities,
    getVenueIds: getVenueIds,
}