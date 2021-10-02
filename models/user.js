const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const imageSchema = new Schema({
    url: String,
    filename: String,    
})

imageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/c_fill,w_300,h_300,r_max")
});
imageSchema.virtual("reviewPic").get(function(){
    return this.url.replace("/upload","/upload/c_fill,w_64,h_66,r_max");
});

const opts = {toJSON: {virtuals: true},timestamps:true};

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
        max:40
    },
    age:
    {
        type: Number,
        min: 1,
        max: 120
    },
    from:
    {
        type: String,
        max: 100
    },
    about:
    {
        type: String,
        max: 500
    },
    profileImage: imageSchema

},opts)

userSchema.plugin(passportLocalMongoose); //this adds on to our schema in a way passport can interface with. it adds a username and password field

module.exports = mongoose.model("User",userSchema);