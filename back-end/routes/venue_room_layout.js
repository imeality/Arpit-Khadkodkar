
function getRoomLayouts (venue_id, conn) {

    var sql = "select * from venueRoomLayout where venue_id = ?";

    conn.query( sql, venue_id, (err, results) => {
        
        if (err) {
            return 'error';
        }

        return results[0];
    })
}


function addRoomLayouts (venueId, roomLayout, conn) {

    var sql = "insert into venueRoomLayout values (?,?,?,?,?,?,?,?,?)";

    conn.query( sql, [venueId, roomLayout], (err, result) => {
       
        if (err) {
            return false;
        }

        return true;
    })
}


function editRoomLayouts (roomLayout, conn) {

    var sql = "update venueRoomLayout set banquet=?, u_shape=?, boardroom=?, theatre=?, classroom=?, reception=?, cabaret=? where venue_id=?";

    conn.query(sql, [roomLayout, venue_id], (err, result) => {

        if (err) {
            return 'error';
        }

        return 'success';
    });
}


function getVenueIds (roomLayout, conn) {

    var sql = "select venue_id from venueRoomLayout where banquet=? or u_shape=? or boardroom=? or theatre=? or classroom=? or reception=? or cabaret=?";

    conn.query(sql, [roomLayout, venue_id], (err, results) => {

        if (err) {
            return 'error';
        }

        return results;
    });
}

module.exports = {
    getRoomLayouts: getRoomLayouts,
    getVenueIds: getVenueIds,
    addRoomLayouts: addRoomLayouts,
    editRoomLayouts: editRoomLayouts,
}