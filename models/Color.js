const mongoose = require("mongoose");

const ColorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
});

ColorSchema.set('timestamps', true);
module.exports = mongoose.model('Category', ColorSchema)