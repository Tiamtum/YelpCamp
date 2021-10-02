const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String,    
})

imageSchema.virtual("thumbnail")
    .get(function(){
        return this.url.replace("/upload","/upload/w_320,h_240")
    });

const opts = {toJSON: {virtuals: true}, timestamps:true};

const campgroundSchema = new Schema({
    title:
    {
        type: String,
        required: true
    },
    geometry:
    {
        type:
        {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates:
        {
            type: [Number],
            required: true
        }
    },
    price:
    {
        type: Number,
        required: true,
        min: 0
    },
    description:
    {
        type: String,
        required: true
    },
    location:
    {
        type: String,
        required: true
    },
    latLong:
    {
        type: String,
        required: true
    },
    images: [imageSchema],
    author:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews:
    [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
},opts)

campgroundSchema.virtual("properties.popUpMarkup").get(function(){
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,35)}...</p>`
});

campgroundSchema.post("findOneAndDelete",async function(document){
    // console.log("[CampgroundSchema Middleware Called] - CampgroundSchema.post(\"findOneAndDelete\",async function(document)\"");
    // console.log(`typeof(document)=${typeof(document)}, document: ${document}`);
    if(document)                        //if a document is to be deleted
    {
        await Review.deleteMany({          //remove those reviews whose ids are in the document's review array
            _id: {
                $in: document.reviews
            }
        })
    }
})

module.exports = mongoose.model("Campground",campgroundSchema);