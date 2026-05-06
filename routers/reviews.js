const express=require("express");
const router=express.Router({mergeParams: true});
const Review = require("../models/Review.js");
const ExpressError=require("../util/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const wrapAsync=require("../util/wrapAysnc.js");
const Listing=require("../models/Listing.js");
const { merge } = require("./listings.js");
const {isLoggedIn,isOwner,isReviewAuthor}= require("../middleware.js");
const reviewController=require("../controllers/review.js");
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else {
        next();
    }
}

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.newReviews));
// delete review from reviews and listing also
router.delete("/:review_id",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;