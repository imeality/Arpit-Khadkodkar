function addSubVenueFacilities (svId, facilities, conn) {

    conn.query("insert into subVenueFacilities values (?,?,?,?,?,?)", [svId, facilities], (err, results) => {

        if (err) {
            return false;
        }

        return true;
    });
}

function getSubVenueFacilities (sv_id, conn) {

    conn.query("select * from subVenueFacilities where sv_id = ?", sv_id, (err, results) => {

        if (err) {
            return 'error';
        } 

        return results[0];
    })    
}


function editSubVenueFacilities (facilities, sv_id, conn) {

    var sql = "update subVenueFacilities set projector_screen=?, projector=?, tv=?, microphone=?, others=? where sv_id = ?";

    conn.query(sql, [facilities, sv_id], (err, result) => {

        if (err) {
            return 'error';
        }

        return 'success';
    });
}



module.exports = {
    addSubVenueFacilities: addSubVenueFacilities,
    getSubVenueFacilities: getSubVenueFacilities,
    editSubVenueFacilities: editSubVenueFacilities,

}