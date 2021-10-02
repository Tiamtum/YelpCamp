if(process.env.NODE_ENV !== "production") 
{
    require("dotenv").config();
}
const ejsMate = require("ejs-mate");
const express = require("express");
const ExpressError = require("./utils/ExpressError");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const MongoStore = require('connect-mongo');
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

app = express();
const port = process.env.PORT || 3000;
//https://mongoosejs.com/docs/deprecations.html

const dbUrl = process.env.DB_URL ||  "mongodb://localhost:27017/YelpCamp";
//const dbUrl = "mongodb://localhost:27017/YelpCamp"

mongoose.connect(dbUrl,
{   useNewUrlParser:true, 
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex: true
})
.then(()=>{
    console.log(`[Mongoose | SUCCESS] - Connection Open @ ${dbUrl}`);
})
.catch((e)=>{
    console.log(`[Mongoose | ERROR] - ${e}`);
})

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname, "public")))
app.use(mongoSanitize());

const secret = process.env.SECRET || "eGXgVDFvzxNLkzzkJGj1"

const sessionConfig={
    store: MongoStore.create({
            mongoUrl: dbUrl,
            secret:secret,
            touchAfter: 24*60*60 //If you are using express-session >= 1.10.0 and don't want to resave all the session on database every single time that the user refresh the page, you can lazy update the session, by limiting a period of time.
        }
    ).on("error",(e)=>console.log(`Session store error: ${e}`)),
    name:"session",
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*7,  //today's date in ms + 1 week in ms
        maxAge: 1000*60*60*24*7,
        httpOnly: true,  //https://owasp.org/www-community/HttpOnly
        sameSite: true,
        //secure: true //this cookie will only work over https
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/doq4wcsuk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize()); //initialize passport
app.use(passport.session()); //for persistent login sessions
passport.use(new LocalStrategy(User.authenticate())); //enables username/password strategy on our User model
passport.serializeUser(User.serializeUser());//https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
passport.deserializeUser(User.deserializeUser());

//allows for ejs pass through
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/reviews",reviewRoutes);
app.use("/",userRoutes);

app.get("/",(req,res)=>{
    res.render("home");
})

app.all("*",(req,res,next)=>{
    next(new ExpressError("Page Not Found",404));
})

app.use((err,req,res,next)=>{  //generic errors
    const {statusCode=500} = err;
    if(!err.message) err.message = "[ERROR] An error occured.";
    res.status(statusCode).render("error",{pageTitle:"Error",error: err,statusCode});
})

app.listen(port,()=>{
    console.log(`Listening on localhost:${port}`);
})