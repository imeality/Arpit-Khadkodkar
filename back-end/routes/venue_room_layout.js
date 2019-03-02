const pool = require('../utilities/connection');

function getRoomLayouts (venue_id) {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }

        var sql = "select * from venueRoomLayout where venue_id = ?";

        conn.query( sql, venue_id, (err, results) => {
            
            conn.release();
            if (err) {
                return 'error';
            }

            return results[0];
        })
    });
}


function addRoomLayouts (roomLayout) {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }

        var sql = "insert into venueRoomLayout values (?,?,?,?,?,?,?,?,?)";

        conn.query( sql, roomLayout, (err, result) => {

            conn.release();
            if (err) {
                return 'error';
            }

            return 'success';
        })
    })
}


function editRoomLayouts (roomLayout,venue_id) {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }

        var sql = "update venueRoomLayout set banquet=?, u_shape=?, boardroom=?, theatre=?, classroom=?, reception=?, cabaret=? where venue_id=?";

        conn.query(sql, [roomLayout, venue_id], (err, result) => {

            conn.release();
            if (err) {
                return 'error';
            }

            return 'success';
        });
    });
}


function getVenueIds (roomLayout) {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }

        var sql = "select venue_id from venueRoomLayout where banquet=? or u_shape=? or boardroom=? or theatre=? or classroom=? or reception=? or cabaret=?";

        conn.query(sql, [roomLayout, venue_id], (err, results) => {

            conn.release();
            if (err) {
                return 'error';
            }

            return results;
        });
    });
}

module.exports = {
    getRoomLayouts: getRoomLayouts,
    getVenueIds: getVenueIds,
    addRoomLayouts: addRoomLayouts,
    editRoomLayouts: editRoomLayouts,
}