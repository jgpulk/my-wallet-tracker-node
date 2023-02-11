const mongoose = require("mongoose");

const IconSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
});

IconSchema.set('timestamps', true);

module.exports = mongoose.model('Icon', IconSchema)