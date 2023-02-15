var express = require('express');
var router = express.Router();

let User = require('../models/User')
let auth = require('../middlewares/auth')

router.get('/view-categories', async(req, res) => {
    console.log("Vieweing user categories");
    res.send(req.headers.token)
});

module.exports = router;
