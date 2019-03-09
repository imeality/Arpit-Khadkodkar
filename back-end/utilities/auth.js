var jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    let token = req.headers['authorization'];

    console.log("inside authorization ---- > > >   ",req.headers['authorization']);

    if(token.startsWith('Bearer')){
        token = token.slice(7, token.length);
    }

    if(token){
        jwt.verify(token, 'Just-use-this-string-as-secret', (err, decoded) => {
            if(err){
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                })
            }else{
                req.decoded = decoded;
                next();
            }
        })
    }else{
        return res.status(401);
    }
}; 