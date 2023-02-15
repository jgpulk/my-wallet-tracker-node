const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function comparePassword(pp,hp){
    return bcrypt.compareSync(pp, hp);
}

function generateJWT(data){
    return jwt.sign({ tokendata : data }, process.env.PRIVATE_KEY_JWT);
}

function requiredLogin(req,res,next){
    if(req.headers.token){
        jwt.verify(req.headers.token,process.env.PRIVATE_KEY_JWT,(err,payload)=> {
            if(err){
                return res.status(401).json({status : false,error : err,message : "Invalid/Expired Token"})
            }
            next();
        })
    } else{
        return res.status(401).json({status : false,message : "No Token Found"})
    }
}

module.exports = { 
    comparePassword,
    generateJWT,
    requiredLogin
}
