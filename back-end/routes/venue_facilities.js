const express = require('express');
const router = express.Router();

const pool = require('../utilities/connection');

function getVenueFacilities (venue_id) {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }

        conn.query("select * from venueFacilities where venue_id = ?", venue_id, (err, results) => {
            conn.release();

            if (err) {
                return 'error';
            }

            return results[0];
        })
    })
}


function editVenueFacilities (venue_id, facilities) {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }

        var sql = "update venueFacilities set gym=?, bar=?, restaurant=?, parking=?, wifi=?, disabled_facility=?, bedroom=?, laundry=?, avTechnician=? others=?";

        conn.query(sql, facilities, (err, result) => {

            conn.release();
            if (err) {
                return 'error';
            }

            return 'success';
        });
    });
}

function getVenueIds (facilities) {

    pool.getConnection ( (err, conn) => {

        if (err) {
            conn.release();
            return 'error';
        }
        
        var sql = "select venue_id from venuesFacilities where gym=?, bar=?, restaurant=?, parking=?, wifi=?, disabled_facility=?, bedroom=?, laundry=?, avTechnician=?";

        conn.query( sql, facilities, (err, results) => {
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
    getVenueFacilities: getVenueFacilities,
    editVenueFacilities: editVenueFacilities,
    getVenueIds: getVenueIds,
}