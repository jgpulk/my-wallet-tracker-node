var express = require('express');
var router = express.Router();

let { Category, Item } = require('../models/Category')
let { addCategoryValidator, deleteCategoryValidator, addSubCategoryValidator, deleteSubCategoryValidator, updateCategoryValidator, updateSubCategoryValidator, validateApp } = require('../validators/category-validator')
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
            color_id : req.body.color_id,
            user_id : req.user_id
        })
        await new_category.save()
        res.status(200).json({ status: true, message : "New category added - "+ new_category.name})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

router.delete('/delete-category/:category_id', validate, deleteCategoryValidator(), validateApp, async (req,res) => {
    try {
        await Category.findOneAndDelete({ user_id: req.user_id, _id : req.params.category_id})
        res.status(200).json({ status: true, message : "Deleted category"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

router.patch('/update-category/:category_id', validate, updateCategoryValidator(), validateApp, async (req,res) => {
    try {
        let updateResult = await Category.findOneAndUpdate(
            { _id: req.params.category_id, $or: [{ name: { $ne: req.body.name } }, { color_id: { $ne: req.body.color_id } }, { icon_id: { $ne: req.body.icon_id } }] },
            { name: req.body.name, color_id: req.body.color_id, icon_id: req.body.icon_id },
            { new: true }
        );
        if(updateResult){
            res.status(200).json({ status: true, message: "Category updated"})
        } else{
            res.status(204).json({ status: false, message: "No changes detected"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

router.post('/:category_id/add-new-subcategory', validate, addSubCategoryValidator(), validateApp, async(req,res) => {
    try {
        let new_subcategory = {
            name : req.body.name,
            icon_id : req.body.icon_id,
            color_id : req.body.color_id
        }
        let result = await Category.findOneAndUpdate(
            { _id : req.params.category_id, user_id: req.user_id },
            {
                $push: {
                    "sub_category": new_subcategory
                }
            },
            { new : true}
        )
        res.status(200).json({ status: true, message : new_subcategory.name+" added to "+ result.name, category: result})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

router.delete('/:category_id/delete-subcategory/:subcategory_id', validate, deleteSubCategoryValidator(), validateApp, async (req,res) => {
    try {
        await Category.findOneAndUpdate({ _id : req.params.category_id}, { $pull: { sub_category: { _id:  req.params.subcategory_id } } }, { new: false })
        res.status(200).json({ status: true, message : "Deleted subcategory"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

router.patch('/:category_id/update-subcategory/:subcategory_id', validate, updateSubCategoryValidator(), validateApp, async (req,res) => {
    // Need to fix update issue.
    try {
        let updateResult = await Category.findOneAndUpdate(
            {
                _id: req.params.category_id,
                "sub_category._id": req.params.subcategory_id,
                $or: [
                    { "sub_category.name": { $ne: req.body.name } },
                    { "sub_category.icon_id": { $ne: req.body.icon_id } },
                    { "sub_category.color_id": { $ne: req.body.color_id } }
                ]
            },
            {
                $set: {
                    "sub_category.$.name": req.body.name,
                    "sub_category.$.icon_id": req.body.icon_id,
                    "sub_category.$.color_id": req.body.color_id
                }
            },
            { new: true }
        )
        if(updateResult){
            res.status(200).json({ status: true, message: "Category updated"})
        } else{
            res.status(204).json({ status: false, message: "No changes detected"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

module.exports = router;
