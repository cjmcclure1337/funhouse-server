const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const artSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Art = mongoose.model("Art", artSchema);

module.exports = Art;