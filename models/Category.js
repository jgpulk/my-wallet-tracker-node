const mongoose = require("mongoose");
var Schema = mongoose.Schema

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon_id: {
        type: Schema.Types.ObjectId,
        ref: 'Icon',
        required: true
    },
    color_id: {
        type: Schema.Types.ObjectId,
        ref: 'Color',
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sub_category  : [
        {
            name: {
                type: String,
                required: true
            },
            icon_id: {
                type: Schema.Types.ObjectId,
                ref: 'Icon',
                required: true
            },
            color_id: {
                type: Schema.Types.ObjectId,
                ref: 'Color',
                required: true
            },
        } 
    ]
});

CategorySchema.set('timestamps', true);
Category = mongoose.model('Category', CategorySchema)

module.exports = {
    Category, CategorySchema
}