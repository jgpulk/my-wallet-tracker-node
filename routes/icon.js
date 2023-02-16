var express = require('express');
var router = express.Router();

const Icon = require('../models/Icon')

router.get('/get-all-icons', async (req, res, next) => {
    try {
        let icons = await Icon.find({}, '_id name link')
        res.status(200).json({ status: true, icons : icons})
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, error: error.message, message: "Something went wrong" })
    }
});

module.exports = router;