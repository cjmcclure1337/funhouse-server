const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const friendSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    city:{
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    phone:{
        type: String,
        required: true,
    },
    website: {
        type: String,
    }
}, {
    timestamps: true
});

const Friend = mongoose.model("Friend", friendSchema);

module.exports = Friend;