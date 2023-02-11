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
Color = mongoose.model('Color', ColorSchema)

module.exports = {
    ColorSchema,
    Color
}