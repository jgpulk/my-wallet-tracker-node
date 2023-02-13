const mongoose = require("mongoose");
var Schema = mongoose.Schema

const { CategorySchema }= require('../models/Category')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    plan_id: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
        default: process.env.BASE_PLAN_ID,
        required: true
    },
    categories : [ CategorySchema ]
});

UserSchema.set('timestamps', true);

module.exports = mongoose.model('User', UserSchema)