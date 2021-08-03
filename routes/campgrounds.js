const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')

const ExpressError=  require('../utils/ExpressError')
const {campgroundSchema} = require('../schemas')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

const Campground =require('../models/campground')

router.get('/', catchAsync(async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))
router.get('/new',isLoggedIn, catchAsync(async (req,res)=> {
    res.render('campgrounds/new');
}))
router.post('/',isLoggedIn, validateCampground , catchAsync(async(req,res,next)=>{
    campground.author = req.user._id;
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
    }
))
router.get('/:id',  catchAsync(async (req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground)
    if(!campground){
        req.flash('error', 'Cannot find the specified Campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}))
router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(async (req, res)=>{
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Cannot find the specified Campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}))

router.put('/:id',isLoggedIn, isAuthor, validateCampground, catchAsync(async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
    req.flash('success', 'Successfully updated Campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', catchAsync(async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground. findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', "you do no have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Campground. :(')
    res.redirect(`/campgrounds/`)
}))

module.exports = router;