var express = require('express');
var router = express.Router();

let User = require('../models/User')
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

module.exports = router;
