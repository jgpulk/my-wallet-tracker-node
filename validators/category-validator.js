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
                let result = await Category.findOne({ user_id: req.user_id, name: value })
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

const updateCategoryValidator = () => {
    return [
        param('category_id')
        .not()
        .trim()
        .isEmpty().withMessage('Invalid URL! Category id not found').bail()
        .isMongoId().withMessage('Invalid category id').bail()
        .custom(async (value, {req}) => {
            // checking category existence
            let category = await Category.findOne({ _id: value, user_id : req.user_id}, '_id name')
            if(!category){
                return Promise.reject('Category not exists');
            }
            return true
        }),
        body('name')
            .not()
            .trim()
            .isEmpty().withMessage('Enter new category name').bail(),
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


const deleteCategoryValidator = () => {
    return [
        param('category_id')
            .not()
            .trim()
            .isEmpty().withMessage('Invalid URL! Category id not found').bail()
            .isMongoId().withMessage('Invalid category id').bail()
            .custom(async (value, {req}) => {
                // checking category existence
                let category = await Category.findOne({ _id: value, user_id : req.user_id}, '_id name')
                if(!category){
                    return Promise.reject('Category not exists');
                }
                return true
            })
    ]
}

const addSubCategoryValidator = () => {
    return [
        body('name')
            .not()
            .trim()
            .isEmpty().withMessage('Enter sub category name').bail(),
        param('category_id')
            .not()
            .trim()
            .isEmpty().withMessage('Invalid URL! Category id not found').bail()
            .isMongoId().withMessage('Invalid category id').bail()
            .custom(async (value, {req}) => {
                // checking category existence
                let category = await Category.findOne({ _id: value, user_id : req.user_id}, 'name sub_category')
                if (category) {
                    // checking sub category name already exists
                    let isFound = category.sub_category.some(element => {
                            if(element.name == req.body.name){
                                return true
                            }
                            return false
                        }
                    )
                    if(isFound){
                        return Promise.reject('Subcategory name already exists');
                    }
                } else{
                    return Promise.reject('Category not exists');
                }
                return true;    
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

const deleteSubCategoryValidator = () => {
    return [
        param('category_id')
            .not()
            .trim()
            .isEmpty().withMessage('Invalid URL! Category id not found').bail()
            .isMongoId().withMessage('Invalid category id').bail()
            .custom(async (value, {req}) => {
                // checking category existence
                let category = await Category.findOne({ _id: value, user_id : req.user_id}, 'name')
                if(!category){
                    return Promise.reject('Category not exists');
                }
                return true   
            }),
        param('subcategory_id')
            .not()
            .trim()
            .isEmpty().withMessage('Invalid URL! subcategory id not found').bail()
            .isMongoId().withMessage('Invalid sub category id').bail()
            .custom(async (value, {req}) => {
                // checking sub category existence
                let sub_category = await Category.findOne({ _id: req.params.category_id, user_id : req.user_id, sub_category: { $elemMatch : { _id : value} }}, 'sub_category')
                if(!sub_category){
                    return Promise.reject('Subcategory not exists');
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
    updateCategoryValidator,
    deleteCategoryValidator,
    addSubCategoryValidator,
    deleteSubCategoryValidator,
    validateApp
}