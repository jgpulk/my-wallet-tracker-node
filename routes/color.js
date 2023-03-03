var express = require('express');
var router = express.Router();

const Color = require('../models/Color')

router.get('/get-all-colors', async (req, res) => {
    try {
        let colors = await Color.find({}, '_id name code')
        res.status(200).json({ status: true, colors : colors})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
});

module.exports = router;
