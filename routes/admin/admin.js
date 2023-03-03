var express = require('express');
var router = express.Router();

/* GET home page. */
const Icon = require('../../models/Icon')
const Color= require('../../models/Color')
const Category = require('../../models/Category')

// Colors

router.post('/color/add-color', async (req,res) => {
    try {
        let new_color = new Color({
            name: req.body.name,
            code: req.body.code
        })
        await new_color.save()
        res.status(200).json({ status: true, message: "New color added - " + new_color.name})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

// Icons

router.post('/icon/add-icon', async (req,res) => {
    try {
        let new_icon = new Icon({
            name: req.body.name,
            link: req.body.link
        })
        await new_icon.save()
        res.status(200).json({ status: true, message: "New icon added - " + new_icon.name})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

router.get('/category/get-all-category', async (req, res) => {
    try {
        let result = await Category.find({})
            .populate('icon_id')
            .populate('color_id')
            .populate('sub_category.icon_id')
            .populate('sub_category.color_id')
        res.status(200).json({ status: true, categories : result})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
});

router.post('/category/add-category', async (req,res) => {
    try {
        let new_category = new Category({
            name: req.body.name,
            icon_id: req.body.icon_id,
            color_id: req.body.color_id
        })
        new_category.save()
        res.status(200).json({ status: true, message: "New category added - " + new_category.name})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

router.post('/category/:categoryid/add-sub-category', async (req,res) => {
    // Need to add category exists or not before adding sub category
    try {
        let new_item = new Item({
            name: req.body.name,
            color_id: req.body.color_id,
            icon_id: req.body.icon_id
        })
        await Category.findByIdAndUpdate(req.params.categoryid, { $push: { sub_category: new_item } }, { new: true }).exec()
        res.status(200).json({ status: true, message: "New sub category added"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
})

module.exports = router;