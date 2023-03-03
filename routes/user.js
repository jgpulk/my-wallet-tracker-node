var express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");

var router = express.Router();

const User = require('../models/User')
const { Category }= require('../models/Category')
const { registerationValidator, loginEmailValidator, loginPhoneValidator, updatePasswordValidator, validateApp } = require('../validators/user-validator');
const auth = require('../middlewares/auth')

router.post('/register', registerationValidator(), validateApp, async function(req,res){
    try {
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
                        password: hash
                    })
                    new_user.save()
                        .then(
                            result => {
                                AddDefaultCategories(result._id)
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

function AddDefaultCategories(user_id){ 
    let default_categories = [
        {
          "name": "Food & Drink",
          "icon_id": "63e8850696012292e3693061",
          "color_id": "63e871ab578c1cabe6976284",
          "user_id": user_id,
          "sub_category": [
            {
              "name": "Bar, cafe",
              "icon_id": "63e884ce5e6794edba42da63",
              "color_id": "63e871ab578c1cabe6976284"
            },
            {
              "name": "Restaurant, fast-food",
              "icon_id": "63e87a2420a1c3d3e132f636",
              "color_id": "63e871ab578c1cabe6976284"
            }
          ]
        },
        {
          "name": "Income",
          "icon_id": "63e8852396012292e3693064",
          "color_id": "63e8716c578c1cabe697627d",
          "user_id": user_id,
          "sub_category": [
            {
              "name": "Wages, invoices",
              "icon_id": "63e883a63f06a223ee49bd61",
              "color_id": "63e8716c578c1cabe697627d"
            },
            {
              "name": "Gambling",
              "icon_id": "63e8847a3f06a223ee49bd69",
              "color_id": "63e8716c578c1cabe697627d"
            },
            {
              "name": "Refunds",
              "icon_id": "63e883c03f06a223ee49bd63",
              "color_id": "63e8716c578c1cabe697627d"
            }
          ]
        },
        {
          "name": "Vehicle",
          "icon_id": "63e8853196012292e3693066",
          "color_id": "63e8719a578c1cabe6976282",
          "user_id": user_id,
          "sub_category": [
            {
              "name": "Fuel",
              "icon_id": "63e879c1d19c4e33c57afd05",
              "color_id": "63e8719a578c1cabe6976282"
            },
            {
              "name": "Parking",
              "icon_id": "63e884893f06a223ee49bd6b",
              "color_id": "63e8719a578c1cabe6976282"
            },
            {
              "name": "Maintenance",
              "icon_id": "63e884963f06a223ee49bd6d",
              "color_id": "63e8719a578c1cabe6976282"
            }
          ]
        },
        {
          "name": "Transportation",
          "icon_id": "63e8853196012292e3693066",
          "color_id": "63e8717e578c1cabe697627f",
          "user_id": user_id,
          "sub_category": [
            {
              "name": "Business trips",
              "icon_id": "63ea0d54058f71de6e55a476",
              "color_id": "63e8717e578c1cabe697627f"
            },
            {
              "name": "Long distance",
              "icon_id": "63ea0d93058f71de6e55a478",
              "color_id": "63e8717e578c1cabe697627f"
            },
            {
              "name": "Public transport",
              "icon_id": "63ea0dcf058f71de6e55a47a",
              "color_id": "63e8717e578c1cabe697627f"
            },
            {
              "name": "Taxi",
              "icon_id": "63ea0dea058f71de6e55a47c",
              "color_id": "63e8717e578c1cabe697627f"
            }
          ]
        }
    ]
    Category.insertMany(default_categories)
    .then(
        result => {
            console.log("Default categories added");
        }
    )
    .catch(
        error => {
            console.log(error);
        }
    )
}

module.exports = router;