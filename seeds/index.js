const express = require('express');
const app =express();
const mongoose = require('mongoose');
const Campground =require('../models/campground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true
})
    .then(
    console.log("connection to database Successfull")
)


const sample = (array)=>array[Math.floor(Math.random()*array.length)];
const seedDB = async function(){
    await Campground.deleteMany({});

    for(let i=0;i<50;++i){
        let random1k = Math.floor(Math.random()*1000)
        const price =  Math.floor(Math.random()*5000) +2000;
        const camp =new Campground({
            location: `${cities[random1k].city}, ${cities[random1k].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt quod cupiditate ratione repudiandae itaque voluptatum hic nemo quo voluptatibus. Perferendis illo atque incidunt. Vel totam tenetur facere! Ex, cumque sae",
            price
        })
        await camp.save();
    }
}

seedDB();


