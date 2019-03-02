const express = require('express');
const router = express.Router();

const pool = require('../utilities/connection');

function getVenueTypes (venue_id) {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }

        conn.query("select * from venueType where venue_id = ?", venue_id, (err, results) => {
            conn.release();

            if (err) {
                return 'error';
            }

            return results[0];
        })
    })
}


function editVenueTypes (venue_id, types) {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }

        var sql = "update venueType set hotel=?, conference_centre=?, sports=?, academic=?, cultural=?, bussiness_centre=?, pub=?, restaurant=?";

        conn.query(sql, types, (err, result) => {

            conn.release();
            if (err) {
                return 'error';
            }

            return 'success';
        });
    });
}

function getVenueIds (types) {

    pool.getConnection ( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }
        
        var sql = "select venue_id from venuesTypes where hotel=?, conference_centre=?, sports=?, academic=?, cultural=?, bussiness_centre=?, pub=?, restaurant=?";

        conn.query( sql, types, (err, results) => {
            conn.release();
            if (err) {
                return 'error';
            }

            return {
                venueIds: results
            };
        })
    })
}

module.exports = {
    getVenueTypes: getVenueTypes,
    editVenueTypes: editVenueTypes,
    getVenueIds: getVenueIds,
}