var express = require('express');
var router = express.Router();

let User = require('../models/User')
let { Category } = require('../models/Category')
let { addCategoryValidator, validateApp } = require('../validators/category-validator')
let { validate } = require('../middlewares/auth')

router.get('/view-categories', validate, async(req, res) => {
    try {
        let user_id = req.user_id
        let result = await User.findOne(
            { _id : user_id },
            'categories._id categories.name categories.icon_id categories.color_id'
        )
        .populate({ path : 'categories.icon_id', select : 'link' })
        .populate({ path : 'categories.color_id', select : 'code' })
        res.status(200).json({ status: true, categories : result.categories })
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
});

router.post('/add-category', validate, addCategoryValidator(), validateApp, async(req,res) => {
    try {
        let new_category = new Category({
            name : req.body.name,
            icon_id : req.body.icon_id,
            color_id : req.body.color_id
        })
        await User.findByIdAndUpdate(req.user_id, { $push: { categories: new_category } }, { new: true }).exec()
        res.status(200).json({ status: true, message : "New category added - "+ new_category.name})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

module.exports = router;
