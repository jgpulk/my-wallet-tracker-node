const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

let User = require('../models/User')

function comparePassword(pp,hp){
    return bcrypt.compareSync(pp, hp);
}

function generateJWT(data){
    return jwt.sign({ tokendata : data }, process.env.PRIVATE_KEY_JWT);
}

async function validate(req,res,next){
    try {
        if(req.headers.token){
            jwt.verify(req.headers.token,process.env.PRIVATE_KEY_JWT,(err,payload)=> {
                if(err){
                    return res.status(401).json({status : false,error : err,message : "Invalid/ Expired token"})
                }
                User.findById(payload.tokendata.user_id, 'email phone plan_id').populate('plan_id')
                .then( 
                    result => {
                        if(result){
                            req.user_id = payload.tokendata.user_id
                            req.user_plan = result.plan_id
                            next();
                        } else{
                            return res.status(404).json({status : false,message : "No user found"})
                        }
                    }
                )
                .catch(
                    error => {
                        console.log(error);
                        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
                    }
                )
            })      
        } else{
            return res.status(401).json({status : false,message : "No token found. Access denied"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
}

module.exports = { 
    comparePassword,
    generateJWT,
    validate
}
