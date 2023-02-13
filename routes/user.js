var express = require('express');
const bcrypt = require('bcrypt');

var router = express.Router();

const User = require('../models/User')
const { Category }= require('../models/Category')
const validator = require('../middlewares/user-validator');

router.post('/register', validator.registerationValidator(), validator.validateApp, async function(req,res){
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

module.exports = router;