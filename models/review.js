const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const opts = {timestamps:true};

const reviewSchema = new Schema({
    body:
    {
        type: String,
        required: true,
        maxLength: 2000
    },
    rating:
    {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    campground:{
        type: Schema.Types.ObjectId,
        ref: "Campground"      
    },
    author: 
    {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},opts);

module.exports = mongoose.model("Review",reviewSchema);