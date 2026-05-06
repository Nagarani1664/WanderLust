const Listing=require("../models/Listing.js");
const Review=require("../models/Review.js")
module.exports.newReviews=async(req,res)=>{
  let listing = await Listing.findById(req.params.id).populate("reviews");
  let newReview= new Review(req.body.review);
  // console.log("Review created");
 
  newReview.author = res.locals.currUser._id;
  listing.reviews.push(newReview);
  await newReview.save();
  // console.log("Review saved");
  const total = listing.reviews.reduce((sum, r) => sum + r.rating, 0);
    listing.avgrating = total / listing.reviews.length;
    await listing.save();
  res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async(req,res)=>{
    let {id,review_id} =req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews: review_id}});
    let rev=await Review.findByIdAndDelete(review_id);
    // console.log("deleted successfully");
    // console.log(rev);
    res.redirect(`/listings/${id}`);

}