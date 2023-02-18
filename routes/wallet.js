var express = require('express');
var router = express.Router();

let Wallet = require('../models/Wallet')
let { validate } = require('../middlewares/auth')
let { createWalletValidator, validateApp } = require('../validators/wallet-validator')

router.post('/create-wallet', validate, createWalletValidator(), validateApp, async (req,res) => {
    try {
        let new_wallet = new Wallet({
            name : req.body.name,
            type : req.body.type,
            balance : req.body.balance,
            color_id : req.body.color_id,
            user_id : req.user_id
        })
        let result = await new_wallet.save()
        res.status(200).json({ status: true, message: "Created wallet", new_wallet: result})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
});

module.exports = router;
