const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const potSchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    glaze: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Pot = mongoose.model("Pot", potSchema);

module.exports = Pot;