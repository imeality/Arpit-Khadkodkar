const pool = require('../utilities/connection');

function getRoomLayouts (venue_id) { // get sub venue room layout for a particular venue_id

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }

        var sql = "select * from svRoomLayout where venue_id = ?";

        conn.query( sql, venue_id, (err, results) => {
            
            conn.release();
            if (err) {
                return 'error';
            }

            return results;
        })
    });
}


function addRoomLayouts (roomLayout) { // insert room layout for a sub venue

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }

        var sql = "insert into svRoomLayout values (?,?,?,?,?,?,?,?,?)";

        conn.query( sql, roomLayout, (err, result) => {

            conn.release();
            if (err) {
                return 'error';
            }

            return 'success';
        })
    })
}


function editRoomLayouts (roomLayout,sv_id) { // edit room layout for a sub venue

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }

        var sql = "update svRoomLayout set banquet=?, u_shape=?, boardroom=?, theatre=?, classroom=?, reception=?, cabaret=? where sv_id=?";

        conn.query(sql, [roomLayout, sv_id], (err, result) => {

            conn.release();
            if (err) {
                return 'error';
            }

            return 'success';
        });
    });
}

module.exports = {
    getRoomLayouts: getRoomLayouts,
    addRoomLayouts: addRoomLayouts,
    editRoomLayouts: editRoomLayouts,
}