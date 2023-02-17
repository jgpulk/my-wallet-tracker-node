var express = require('express');
const bcrypt = require('bcrypt');

var router = express.Router();

const User = require('../models/User')
const { Category }= require('../models/Category')
const { registerationValidator, loginEmailValidator, loginPhoneValidator, updatePasswordValidator, validateApp } = require('../validators/user-validator');
const auth = require('../middlewares/auth')

router.post('/register', registerationValidator(), validateApp, async function(req,res){
    try {
        let result = await Category.find({})
        bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), function (err, salt) {
            if (err) {
                res.status(500).json({ status: false, error: err.message, message: "salt generation failed" })
            }
            bcrypt.hash(req.body.confirm_password, salt, function (err, hash) {
                if (err) {
                    res.status(500).json({ status: false, error: err.message, message: "hash generation failed" })
                }
                try {
                    let new_user = new User({
                        email: req.body.email,
                        phone: req.body.phone,
                        password: hash,
                        categories : result
                    })
                    new_user.save()
                        .then(
                            result => {
                                res.status(200).json({ status: true, message: "creating user", new_user: result})
                            }
                        )
                        .catch(
                            error => {
                                console.log(error);
                                res.status(500).json({ status: false, error: error.message, message: "Something went wrong. User registeration failed" })
                            }
                        )
                } catch (error) {
                    console.log(error);
                    res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
                }
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

router.post('/email/login', loginEmailValidator(), validateApp ,async (req,res) => {
    try {
        let user = await User.findOne({ email: req.body.email}, '_id password')
        if(user){
            let result = auth.comparePassword(req.body.password,user.password)
            if(result){
                let userData = {
                    user_id : user._id
                }
                let token = auth.generateJWT(userData)
                res.status(200).json({ status: true, token: token, message: "Login sucess" })
            } else{
                res.status(401).json({ status: false, message: "Invalid Password" })
            }
        } else{
            res.status(404).json({ status: false, message: "No user found" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

router.post('/phone/login', loginPhoneValidator(), validateApp, async (req,res) => {
    try {
        let user = await User.findOne({ phone: req.body.phone}, '_id password')
        if(user){
            let result = auth.comparePassword(req.body.password,user.password)
            if(result){
                let userData = {
                    user_id : user._id
                }
                let token = auth.generateJWT(userData)
                res.status(200).json({ status: true, token: token, message: "Login sucess" })
            } else{
                res.status(401).json({ status: false, message: "Invalid Password" })
            }
        } else{
            res.status(404).json({ status: false, message: "No user found" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

router.get('/view-profile', auth.validate, async(req,res) => {
    try {
        let result = await User.findOne({ _id : req.user_id}, '_id name email phone')
        res.status(200).json({ status: true, profile: result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

router.post('/update-profile', auth.validate, async(req,res) => {
    try {
        await User.findByIdAndUpdate({ _id: req.user_id }, { name: req.body.name })
        res.status(200).json({ status: true, message: "Profile updated"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

router.post('/update-password', auth.validate, updatePasswordValidator(), validateApp, async(req,res) => {
    try {
        let user = await User.findById(req.user_id, 'password')
        let comparePassword = auth.comparePassword(req.body.current_password, user.password)
        if(comparePassword){
            bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), function (err, salt) {
                if (err) {
                    res.status(500).json({ status: false, error: err.message, message: "salt generation failed" })
                }
                bcrypt.hash(req.body.confirm_password, salt, function (err, hash) {
                    if (err) {
                        res.status(500).json({ status: false, error: err.message, message: "hash generation failed" })
                    }
                    try {
                        User.findByIdAndUpdate({ _id: req.user_id }, { password: hash },{
                            returnNewDocument: true
                         } )
                            .then(
                                result => {
                                    res.status(200).json({ status: true, message: "Updated password", result : result })
                                }
                            )
                      } catch (error) {
                        console.log(error);
                        res.status(500).json({ status: false, error: err.message, message: "Something went wrong! Update password failed" })
                    }
                })
            })
        } else{
            res.status(401).json({ status: false, message: "Invalid current password" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

module.exports = router;