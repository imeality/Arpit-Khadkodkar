
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


function editRoomLayouts (roomLayout, venue_id, conn) {

    var sql = "update venueRoomLayout set ? where venue_id=?";

    conn.query(sql, [roomLayout, venue_id], (err, result) => {

        if (err) {
            return 'error';
        }

        return 'success';
    });
}




module.exports = {
    getRoomLayouts: getRoomLayouts,
    addRoomLayouts: addRoomLayouts,
    editRoomLayouts: editRoomLayouts,
}