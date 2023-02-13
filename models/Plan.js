const mongoose = require("mongoose");
var Schema = mongoose.Schema

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    wallets: {
        type: Number,
        required: true
    }
});

PlanSchema.set('timestamps', true);

module.exports = mongoose.model('plan', PlanSchema)