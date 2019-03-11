var jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.headers['authorization'];

        //console.log("inside authorization  token is ---- > > >   ",req.headers['authorization']);

    if(token.startsWith('Bearer')){
        token = token.slice(7, token.length);
    }

    if(token){
        jwt.verify(token, 'Just-use-this-string-as-secret', (err, decoded) => {
            if(err){
                //console.log(" got an error ")
                return res.send({
                    success: false,
                    message: 'Token is not valid'
                })
            }else{
                req.decoded = decoded;
                //console.log("decoded  ==> ", decoded);
                next();
            }
        })
    }else{
       // console.log(" auth  status 401 ");
        return res.send({
            success: false,
            message: 'not authorized'
        });
    }
}; 