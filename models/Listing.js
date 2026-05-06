const mongoose = require("mongoose");
const Review = require("./Review");
const { ref } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String
  },
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref : "Review",
    }
  ],
  owner : 
    {
      type:Schema.Types.ObjectId,
      ref:"User",
    },
  geometry: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point"
  },
  coordinates: [Number]
},
avgrating: {
  type: Number,
  default: 0
},
category :{
  type : String,
  enum :["Mountains","Castles","Pools","Camping","Farm","Snow"],
}
});
listingSchema.post('findOneAndDelete',async(listing)=>{
  if(listing) {
    await Review.deleteMany({_id : {$in : listing.reviews}});
  }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;