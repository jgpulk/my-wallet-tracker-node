const { body, validationResult } = require('express-validator')

const mongoose = require("mongoose")
const User = require('../models/User')

const addCategoryValidator = () => {
    return [
        body('name')
            .not()
            .trim()
            .isEmpty().withMessage('Enter category name').bail()
            .custom(async (value, {req}) => {
                // checking category name already exists
                // User.findOne({ _id : req.user_id, categories: { $elemMatch : { name : req.body.name} },'categories.name')
                let result = await User.findOne({ _id: req.user_id, "categories.name": req.body.name }, 'categories.name')
                if(result){
                    return Promise.reject('Category name already exists')
                }
                return true
            }),
        body('icon_id')
            .not()
            .trim()
            .isEmpty().withMessage('Select a icon').bail()
            .custom(async value => {
                if(!(mongoose.isObjectIdOrHexString(value))){
                    return Promise.reject('Invalid icon')
                }
                return true
            }),
        body('color_id')
            .not()
            .trim()
            .isEmpty().withMessage('Select a color').bail()
            .custom(async (value , {req}) => {
                if(!(mongoose.isObjectIdOrHexString(value))){
                    return Promise.reject('Invalid color')
                }
                return true
            })
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
    addCategoryValidator,
    validateApp
}