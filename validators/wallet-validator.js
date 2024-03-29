const { body, param, validationResult } = require('express-validator')

const mongoose = require("mongoose")
const Wallet = require('../models/Wallet')
const { Color } = require('../models/Color')

const createWalletValidator = () => {
    return [
        body('name')
            .not()
            .trim()
            .isEmpty().withMessage('Enter wallet name').bail()
            .custom(async (wallet_name, {req}) => {
                // checking wallet name already exists
                let result = await Wallet.findOne({ user_id : req.user_id, name : wallet_name}, '_id')
                if(result){
                    return Promise.reject('Wallet name already exists')
                }
                return true
            }),
        body('type')
            .not()
            .trim()
            .isEmpty().withMessage('Enter wallet type').bail()
            .isIn(["Cash", "General", "Savings Account", "Salary Account", "Wallet", "Credit Card"]).withMessage('Invalid wallet type').bail(),
        body('balance')
            .not()
            .trim()
            .isEmpty().withMessage('Enter current wallet balance').bail()
            .isNumeric().withMessage('Enter a numeric value').bail(),
        body('color_id')
            .not()
            .trim()
            .isEmpty().withMessage('Select a color').bail()
            .isMongoId().withMessage('Invalid color id').bail()
            .custom(async value => {
                const color = await Color.findById(value);
                if (!color) {
                    return Promise.reject('Color not exists');
                }
                return true;
            })
    ]
}

const deleteWalletValidator = () => {
    return [
        param('wallet_id')
            .not()
            .trim()
            .isEmpty().withMessage('Select a wallet').bail()
            .isMongoId().withMessage('Invalid wallet id').bail()
            .custom(async ( value, {req}) => {
                // checking wallet exists
                let wallet = await Wallet.findOne({ user_id: req.user_id, _id: value}, '_id')
                if(!wallet){
                    return Promise.reject('Wallet not exists')
                }
                return true
            })
    ]
}

const updateWalletValidator = () => {
    return [
        param('wallet_id')
            .not()
            .trim()
            .isEmpty().withMessage('Select a wallet').bail()
            .isMongoId().withMessage('Invalid wallet id').bail()
            .custom(async ( value, {req}) => {
                // checking wallet exists
                let wallet = await Wallet.findOne({ user_id: req.user_id, _id: value}, '_id')
                if(!wallet){
                    return Promise.reject('Wallet not exists')
                }
                return true
            }),
        body('name')
            .not()
            .trim()
            .isEmpty().withMessage('Enter wallet name').bail(),
        body('type')
            .not()
            .trim()
            .isEmpty().withMessage('Enter wallet type').bail()
            .isIn(["Cash", "General", "Savings Account", "Salary Account", "Wallet", "Credit Card"]).withMessage('Invalid wallet type').bail(),
        body('balance')
            .not()
            .trim()
            .isEmpty().withMessage('Enter current wallet balance').bail()
            .isNumeric().withMessage('Enter a numeric value').bail(),
        body('color_id')
            .not()
            .trim()
            .isEmpty().withMessage('Select a color').bail()
            .isMongoId().withMessage('Invalid color id').bail()
            .custom(async value => {
                const color = await Color.findById(value);
                if (!color) {
                    return Promise.reject('Color not exists');
                }
                return true;
            })
    ]
}

const viewWalletValidator = () => {
    return [
        param('wallet_id')
            .not()
            .trim()
            .isEmpty().withMessage('Select a wallet').bail()
            .isMongoId().withMessage('Invalid wallet id').bail()
            .custom(async ( value, {req}) => {
                // checking wallet exists
                let wallet = await Wallet.findOne({ user_id: req.user_id, _id: value}, '_id')
                if(!wallet){
                    return Promise.reject('Wallet not exists')
                }
                return true
            }),
    ]
}

const validateApp = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    //errors.array()[0].msg
    res.status(400).json({ status: false, message: errors.array() });
}

module.exports = {
    createWalletValidator,
    deleteWalletValidator,
    updateWalletValidator,
    viewWalletValidator,
    validateApp
}