const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const User = require('./user')
const opts = { toJSON: { virtuals: true } };
const ImageSchema = new Schema({
    url:String,
   filename: String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});


const CampgroundSchema = new Schema({
     geometry: {
        type: {
          type: String,
          enum: ['Point'],

        },
        coordinates: {
          type: [Number],
        }
      },
     title:String,
     price:Number,
     description: String,
     location: String,
     images: [ImageSchema],
     author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
     },
     reviews: [
         {
             type: Schema.Types.ObjectId,
            ref: 'Review'
         }
     ]
 }, opts);

 CampgroundSchema.virtual('properties.popUpMarkUp').get(function(){
    return `<strong><a href="campgrounds/${this._id}"> ${this.title}</a></strong>
    <p>${this.location}
    <br> ₹ ${this.price}</p>`;
});

CampgroundSchema.post('findOneAndDelete', async function(camp){
    if(camp){
        await Review.deleteMany({
            _id:{
                $in:camp.reviews
            }
        })
    }
})
 module.exports = mongoose.model('Campground', CampgroundSchema);
 