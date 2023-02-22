const { body, param, validationResult } = require('express-validator')

const User = require('../models/User')
const Icon = require('../models/Icon')
const { Color } = require('../models/Color')
const { Category } = require('../models/Category')

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
            .isMongoId().withMessage('Invalid icon id').bail()
            .custom(async value => {
                let icon = await Icon.findById(value, '_id');
                if (!icon) {
                    return Promise.reject('Icon not exists');
                }
                return true;
            }),
        body('color_id')
            .not()
            .trim()
            .isEmpty().withMessage('Select a color').bail()
            .isMongoId().withMessage('Invalid color id').bail()
            .custom(async value => {
                let color = await Color.findById(value, '_id');
                if (!color) {
                    return Promise.reject('Color not exists');
                }
                return true;
            })
    ]
}

const addSubCategoryValidator = () => {
    return [
        param('category_id')
            .not()
            .trim()
            .isEmpty().withMessage('Invalid URL! Category id not found').bail()
            .isMongoId().withMessage('Invalid category id').bail()
            .custom(async (value, {req}) => {
                let category = await User.findOne({ _id: req.user_id, "categories._id": value }, 'categories.name')
                if (!category) {
                    return Promise.reject('Category not exists');
                }
                return true;    
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
    addSubCategoryValidator,
    validateApp
}