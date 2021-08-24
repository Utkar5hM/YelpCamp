const express = require('express');
const app =express();
const mongoose = require('mongoose');
const Campground =require('../models/campground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')

const campPhotoLinks = [{url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783309/YelpCamp/pexels-cottonbro-5994749_ah4l88.jpg"
 ,filename:"YelpCamp/pexels-cottonbro-5994749_ah4l88"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783308/YelpCamp/pexels-quang-nguyen-vinh-4268140_ix22fd.jpg"
 ,filename:"YelpCamp/pexels-quang-nguyen-vinh-4268140_ix22fd"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783308/YelpCamp/pexels-matheus-bertelli-7510634_ivkdkf.jpg"
 ,filename:"YelpCamp/pexels-matheus-bertelli-7510634_ivkdkf"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783307/YelpCamp/pexels-cottonbro-5994742_fpjvug.jpg"
 ,filename:"YelpCamp/pexels-cottonbro-5994742_fpjvug.jpg"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783306/YelpCamp/tommy-lisbin-2DH-qMX6M4E-unsplash_1_l59dkc.jpg"
 ,filename:"YelpCamp/tommy-lisbin-2DH-qMX6M4E-unsplash_1_l59dkc"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783304/YelpCamp/pexels-mikhail-nilov-6623925_dsbbub.jpg"
 ,filename:"YelpCamp/pexels-mikhail-nilov-6623925_dsbbub"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783305/YelpCamp/pexels-anna-shvets-4014888_nsyhcy.jpg"
 ,filename:"YelpCamp/pexels-anna-shvets-4014888_nsyhcy"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783304/YelpCamp/pexels-michel-paz-2473845_ybqodi.jpg"
 ,filename:"YelpCamp/pexels-michel-paz-2473845_ybqodi"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783303/YelpCamp/pexels-%D0%B8%D0%B3%D0%BE%D1%80%D1%8C-%D1%86%D1%8B%D0%B1%D1%83%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9-8713324_me7hba.jpg"
 ,filename:"YelpCamp/pexels-%D0%B8%D0%B3%D0%BE%D1%80%D1%8C-%D1%86%D1%8B%D0%B1%D1%83%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B9-8713324_me7hba"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783303/YelpCamp/pexels-hamid-tajik-5779093_zznbuj.jpg"
 ,filename:"YelpCamp/pexels-hamid-tajik-5779093_zznbuj"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783302/YelpCamp/everett-mcintire-BPCsppbNRMI-unsplash_bqh9cr.jpg"
 ,filename:"YelpCamp/everett-mcintire-BPCsppbNRMI-unsplash_bqh9cr"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783301/YelpCamp/pexels-cottonbro-6003064_mxivry.jpg"
 ,filename:"YelpCamp/pexels-cottonbro-6003064_mxivry"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783300/YelpCamp/falaq-lazuardi-YAyt4ZePq80-unsplash_zvutve.jpg"
 ,filename:"YelpCamp/falaq-lazuardi-YAyt4ZePq80-unsplash_zvutve"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783300/YelpCamp/pexels-xue-guangjian-1687845_hazvf9.jpg"
 ,filename:"YelpCamp/pexels-xue-guangjian-1687845_hazvf9"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783300/YelpCamp/pexels-matthew-devries-2526025_oro37u.jpg"
 ,filename:"YelpCamp/pexels-matthew-devries-2526025_oro37u"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783299/YelpCamp/kilarov-zaneit-Hxs6EAdI2Q8-unsplash_imzrhe.jpg"
 ,filename:"kilarov-zaneit-Hxs6EAdI2Q8-unsplash_imzrhe"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783299/YelpCamp/julie-rotter-Y03s37C6tQk-unsplash_ic677w.jpg"
 ,filename:"YelpCamp/julie-rotter-Y03s37C6tQk-unsplash_ic677w"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783299/YelpCamp/paxson-woelber-1yOkW4UwYbA-unsplash_ai2crb.jpg"
 ,filename:"YelpCamp/paxson-woelber-1yOkW4UwYbA-unsplash_ai2crb"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783298/YelpCamp/pexels-snapwire-699558_cyuqwy.jpg"
 ,filename:"YelpCamp/pexels-snapwire-699558_cyuqwy"},
 {url:"https://res.cloudinary.com/dn5mgadog/image/upload/v1629783299/YelpCamp/pexels-sagui-andrea-618848_y1mzo2.jpg"
 ,filename:"YelpCamp/pexels-sagui-andrea-618848_y1mzo2"}
]


mongoose.connect('mongodb+srv://utk:VcHgfqdGYTSMUtym@yelpcamp.o2gmk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
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

    for(let i=0;i<150;++i){
        let random1k = Math.floor(Math.random()*1000)
        const price =  Math.floor(Math.random()*5000) +2000;
        const randomPicFirst =Math.floor(Math.random()*20);
        const randomPicSecond =Math.floor(Math.random()*20);
         const camp =new Campground({
            author: '6123cac6c678e80016af34b0',
            location: `${cities[random1k].city}, ${cities[random1k].state}`,
            geometry: {
              type:'Point',
              coordinates: [`${cities[random1k].longitude}`, `${cities[random1k].latitude}`],
            },
            title:`${sample(descriptors)} ${sample(places)}`,
            images: [
              campPhotoLinks[randomPicFirst],
              campPhotoLinks[randomPicSecond]
              ],
            description: "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt quod cupiditate ratione repudiandae itaque voluptatum hic nemo quo voluptatibus. Perferendis illo atque incidunt. Vel totam tenetur facere! Ex, cumque sae",
            price
            
        })
        await camp.save();
        
    }  
    console.log("successfully Seeded")
}

seedDB();


