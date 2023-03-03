var express = require('express');
var router = express.Router();

let User = require('../models/User')
let Category = require('../models/Category')
let { addCategoryValidator, addSubCategoryValidator, validateApp } = require('../validators/category-validator')
let { validate } = require('../middlewares/auth')

router.get('/view-categories', validate, async(req, res) => {
    try {
        let categories = await Category.find({ user_id : req.user_id},'name sub_category')
            .populate('icon_id', 'name link')
            .populate('color_id', 'name code')
            .populate('sub_category.icon_id', 'name link')
            .populate('sub_category.color_id', 'name code')
        res.status(200).json({ status: true, categories : categories })
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

router.post('/:category_id/add-new-subcategory', validate, addSubCategoryValidator(), validateApp, async(req,res) => {
    try {
        let new_subcategory = new Item({
            name : req.body.name,
            icon_id : req.body.icon_id,
            color_id : req.body.color_id
        })
        let result = await User.findOneAndUpdate(
            { "_id": req.user_id, "categories._id": req.params.category_id },
            {
                $push: {
                    "categories.$.sub_category": new_subcategory
                }
            },
            { new : true}
        )
        res.send(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

module.exports = router;
