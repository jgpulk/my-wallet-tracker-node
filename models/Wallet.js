const mongoose = require("mongoose");
var Schema = mongoose.Schema

const WalletSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Cash", "General", "Savings Account", "Salary Account", "Wallet", "Credit Card"],
        required: true
    },
    balance: {
        type: Number,
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
    status: {
        type: String,
        default: "active",
        enum: ["active", "disabled"]
    }
});

WalletSchema.set('timestamps', true)
module.exports = mongoose.model('Wallet', WalletSchema)