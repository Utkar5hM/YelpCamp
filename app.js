const express = require('express');
const app =express();
const path = require('path')
const mongoose = require('mongoose');
const Campground =require('./models/campground')
const methodOverride = require('method-override')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true
});
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'))

app.listen(3000, ()=>{
    console.log("connection successfull at port:3000")
})
app.get('/', (req,res)=>{
    res.render('home');
})
app.get('/campgrounds', async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
})
app.get('/campgrounds/new', async (req,res)=> {
    res.render('campgrounds/new');
})
app.post('/campgrounds', (req,res)=>{
    const campground = new Campground(req.body.campground);
    campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})
app.get('/campgrounds/:id', async (req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground})
})
app.get('/campgrounds/:id/edit', async (req, res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground})
})

app.put('/campgrounds/:id', async (req,res)=>{
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id', async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds/`)
})