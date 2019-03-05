
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


function editVenueFacilities (facilities, venueId, conn) {

    var sql = "update venueFacilities set gym=?, bar=?, restaurant=?, parking=?, wifi=?, disabled_facility=?, bedroom=?, laundry=?, avTechnician=? others=? where venue_id = ?";

    conn.query(sql, [facilities, venueId], (err, result) => {

        if (err) {
            return 'error';
        }

        return 'success';
    });
}



module.exports = {
    addVenueFacilities: addVenueFacilities,
    getVenueFacilities: getVenueFacilities,
    editVenueFacilities: editVenueFacilities,

}