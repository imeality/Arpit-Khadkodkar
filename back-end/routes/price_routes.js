var router = require('express').Router();
var pool = require('../utilities/connection');

router.post('/add/:sv_id', (req, res) => {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release()
            return res.status(500).end();
        }
        console.log("---------------");
        console.log(req.body.time_slot);
        var svId = req.params.sv_id;
        var timeSlot = req.body.time_slot;
        var len = timeSlot.length;
        var price = req.body.price;
        
        var sql = "insert into price values ("+svId+", '"+timeSlot[0]+"', "+price[0]+")";
        for( var i=1; i<len; i++) {
            sql += ", ("+svId+", '"+timeSlot[i]+"', "+price[i]+")";
        }

        conn.query(sql, (err, result) => {
            conn.release();
            if(err) {
                console.log(err);
                return res.status(500).end();
            }

            return res.status(200).end();
        })
    });
});

router.get('user/:sv_id', (req, res) => { // user

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release()
            return res.status(500).end();
        }

        conn.query("select time_slot, price from price where sv_id = ?", req.params.sv_id, (err, results) => {

            conn.release();
            if(err) {
                console.log(err);
                return res.status(500).end();
            }

            console.log("-- result ", results);

            return res.status(200).json({
                data: results,
            });
        });
    });
});

router.get('moderator/:sv_id', (req, res) => { // moderator

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release()
            return res.status(500).end();
        }

        conn.query("select price_id, time_slot, price from price where sv_id = ?", req.params.sv_id, (err, results) => {

            conn.release();
            if(err) {
                console.log(err);
                return res.status(500).end();
            }

            console.log("-- result ", results);

            return res.status(200).json({
                data: results,
            });
        });
    });
});

router.patch('/edit/price/:price_id', (req, res) => {

    pool.getConnection( (err, conn) => {

        if (err) {
            conn.release()
            return res.status(500).end();
        }

        conn.query("update price set price=? where price_id = ?", req.params.price_id, (err, results) => {

            conn.release();
            if(err) {
                console.log(err);
                return res.status(500).end();
            }

            console.log("-- result ", results);

            return res.status(200).json({
                data: results,
            });
        });
    })
})

// router.patch('/edit/time_slots/:sv_id', (req, res) => {

//     pool.getConnection( (err, conn) => {

//         if (err) {
//             conn.release()
//             return res.status(500).end();
//         }

//         conn.query("delete from price where sv_id = ?", req.params.sv_id, (err, results) => {

            
//             if(err) {
//                 console.log(err);
//                 conn.release();
//                 return res.status(500).end();
//             }

//             console.log("-- result ", results);

            
//         });
//     })
// });


module.exports = router;