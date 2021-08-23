if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
} 
const express = require('express');
const app =express();

const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
// This disables the `contentSecurityPolicy` middleware but keeps the rest.
app.use(
    helmet()
  );

// Helmet exclusions
const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
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
                "https://res.cloudinary.com/dn5mgadog/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// above code helmet exclusions from Github/Colt.

const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const flash = require('connect-flash')
const Joi =require('joi')
const {campgroundSchema, reviewSchema} = require('./schemas')
const catchAsync = require('./utils/catchAsync')
const Campground =require('./models/campground')
const methodOverride = require('method-override')
const ExpressError=  require('./utils/ExpressError')
const Review = require('./models/review')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')


//routes
const userRoutes =require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')



const mbxGeoCodings = require('@mapbox/mapbox-sdk/services/geocoding');

const dbUrl= process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
const secretCode = process.env.SECRET;
// 'mongodb://localhost:27017/yelp-camp' or process.env.DB_URL depending on localhost or atlas

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify: false
}) .then (console.log("mongo success"));
app.use(methodOverride('_method'))

app.use(express.urlencoded({extended:true}))
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize());

/* app.use(express.session({
    secret: 'aweaksecret',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    store: MongoStore.create({
      mongoUrl: dbUrl,
      touchAfter: 24 * 3600 // time period in seconds
    })
  }));


 */

const store = new MongoStore({
    url: dbUrl,
    secret: secretCode,
    touchAfter: 24*3600
})
store.on("error", function(e){
    console.log("session store error", e)
})

const sessionConfig = {
    store,
    name: "hehe",
    secret: secretCode,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        /* secure:true,  for Https*/
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
        }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.get('/', (req,res)=>{
    res.render('home');
})

app.all('*', (req,res,next)=>{
    next(new ExpressError('Page Not Found', 404))
})
app.use((err,req,res,next)=>{
    const {statusCode=500, message="something went wrong"} =err;
    if(!err.message) err.message = "Oh no,Something went wrong."
    res.status(statusCode).render('error', {err})
})
const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log("connection successfull at port:3000")
})