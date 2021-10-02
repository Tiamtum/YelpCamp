const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const {places,descriptors} = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/YelpCamp",
{   useNewUrlParser:true, 
    useUnifiedTopology:true,
    useFindAndModify:false
})
.then(()=>{
    console.log("[Mongoose | SUCCESS] - Connection Open")
})
.catch((e)=>{
    console.log(`[Mongoose | ERROR] - ${e}`);
})

const sample = array => array[Math.floor(Math.random()*array.length)];
const getPrice = () => Math.floor(Math.random()*20)+10
const date = new Date().toISOString();
const seedDB = async() =>{
    await Campground.deleteMany({});
    for(let i = 0 ; i<5; i++)
    {
        const random1000 = Math.floor(Math.random()*1000);
        const price = getPrice();
        const camp = new Campground({
            author: "6138384bdfb46412657b6bec",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            latLong: "47.464116847184584, -52.705984601732624",
            createdAt: date,
            updatedAt: date,
            geometry: 
            { 
              type: 'Point', 
              coordinates: [cities[random1000].longitude,
                            cities[random1000].latitude ]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/doq4wcsuk/image/upload/v1630337566/YelpCamp/w9xaxnavjette1bp2bog.jpg',
                  filename: 'YelpCamp/w9xaxnavjette1bp2bog'
                },
                {
                  url: 'https://res.cloudinary.com/doq4wcsuk/image/upload/v1630337566/YelpCamp/lenwjmtcpeopawdxn0yb.jpg',
                  filename: 'YelpCamp/lenwjmtcpeopawdxn0yb'
                },
                {
                  url: 'https://res.cloudinary.com/doq4wcsuk/image/upload/v1630337566/YelpCamp/umc6xotsj1suymi4irep.jpg',
                  filename: 'YelpCamp/umc6xotsj1suymi4irep'
                },
                {
                  url: 'https://res.cloudinary.com/doq4wcsuk/image/upload/v1630337567/YelpCamp/k4twfflabrqo1w6nizry.jpg',
                  filename: 'YelpCamp/k4twfflabrqo1w6nizry'
                }
              ],
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel orci sit amet odio auctor interdum. Vivamus feugiat vehicula arcu, eu porta augue iaculis at.",
            price: price
        });
        await camp.save();
    }
    for(let i = 0 ; i<5; i++)
    {
        const random1000 = Math.floor(Math.random()*1000);
        const price = getPrice();
        const camp = new Campground({
            author: "61383865dfb46412657b6c00",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            latLong: "47.464116847184584, -52.705984601732624",
            createdAt: date,
            updatedAt: date,
            geometry: 
            { 
              type: 'Point', 
              coordinates: [cities[random1000].longitude,
                            cities[random1000].latitude ]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {                 
                  url: 'https://res.cloudinary.com/doq4wcsuk/image/upload/v1630337643/YelpCamp/mokqfoffhau07iilzenj.jpg',
                  filename: 'YelpCamp/mokqfoffhau07iilzenj'
                },
                {
                  url: 'https://res.cloudinary.com/doq4wcsuk/image/upload/v1631053449/YelpCamp/hzs61rfsb90oweacnisx.png',
                  filename: 'YelpCamp/qjlyhpbmkvubny57gb7c'
                }
            ],
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel orci sit amet odio auctor interdum. Vivamus feugiat vehicula arcu, eu porta augue iaculis at.",
            price: price
        });
        await camp.save();
    }
}
seedDB().then(()=>mongoose.connection.close());