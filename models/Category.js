const mongoose = require("mongoose");
var Schema = mongoose.Schema

const ItemSchema = new mongoose.Schema({
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
    }
})

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
    }
    ,
    sub_category: {
        type: [ ItemSchema ]
        // type: [{ type : Schema.Types.ObjectId, ref: 'Category'}]
    }
});

CategorySchema.set('timestamps', true);
Category = mongoose.model('Category', CategorySchema)
Item = mongoose.model('Item', ItemSchema)

module.exports = {
    Category,Item
}