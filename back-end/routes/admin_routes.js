const pool = require('../utilities/connection');

const router = require('express').Router();

const jwt = require('jsonwebtoken');
const auth = require('../utilities/auth');

router.post('/login', (req, res) => {

    //console.log(" admin login got called ", req.body.email);
    pool.getConnection( (err, conn) => {
      //  console.log( " inside pool " );
        if (err) { 
            conn.release();
            console.log(" pool error --> ", err);
            return res.status(500).end();
        }

        conn.query("select * from admin where email = ? and password = ?", [req.body.email, req.body.password], (err, result) => {

            conn.release();
            if (err) {
                console.log ( " error in query ", err)
                return res.status(500).end();
            }

            if(result.length !=0){
                const token = jwt.sign(
                    {email: result[0].email},
                    'Just-use-this-string-as-secret',
                    {expiresIn: 84600 }
                )

                return res.status(200).json({
                    data: result,
                    token: token
                })
            } else {
                return res.status(401).end();
            }
        })
    })
})

module.exports = router;