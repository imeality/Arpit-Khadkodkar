function addSubVenueLayouts (svId, layouts, conn) {

    conn.query("insert into svRoomLayout values (?,?,?,?,?,?,?,?,?)", [svId, layouts], (err, results) => {

        if (err) {
            return false;
        }

        return true;
    });
}

function getSubVenueLayouts (sv_id, conn) {

    conn.query("select * from svRoomLayout where sv_id = ?", sv_id, (err, results) => {

        if (err) {
            return 'error';
        }

        return results[0];
    })    
}


function editSubVenueLayouts (layouts, sv_id, conn) {

    var sql = "update svRoomLayout set banquet=?, u_shape=?, boardroom=?, theatre=?, classroom=?, reception=?, cabaret=? where sv_id = ?";

    conn.query(sql, [layouts, sv_id], (err, result) => {

        if (err) {
            return 'error';
        }

        return 'success';
    });
}



module.exports = {
    addSubVenueLayouts: addSubVenueLayouts,
    getSubVenueLayouts: getSubVenueLayouts,
    editSubVenueLayouts: editSubVenueLayouts,

}