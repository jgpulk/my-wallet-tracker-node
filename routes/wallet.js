var express = require('express');
var router = express.Router();

let Wallet = require('../models/Wallet')
let { validate } = require('../middlewares/auth')
let { createWalletValidator, validateApp } = require('../validators/wallet-validator')

router.post('/create-wallet', validate, createWalletValidator(), validateApp, async (req,res) => {
    try {
        let current_wallet_count = await Wallet.count({ user_id: req.user_id });
        if(req.user_plan.wallets > current_wallet_count){
            let new_wallet = new Wallet({
                name : req.body.name,
                type : req.body.type,
                balance : req.body.balance,
                color_id : req.body.color_id,
                user_id : req.user_id
            })
            let result = await new_wallet.save()
            res.status(200).json({ status: true, message: "Created wallet", new_wallet: result})
        } else{
            res.status(423).json({ status: false, message: "Please upgrade your plan" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
});

router.get('/view-wallets', validate, async (req,res) => {
    try {
        let wallets = await Wallet.find({ user_id: req.user_id }, 'name balance status')
            .populate('color_id','code')
        res.status(200).json({ status: true, message: "Showing wallets", wallets: wallets})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

module.exports = router;
