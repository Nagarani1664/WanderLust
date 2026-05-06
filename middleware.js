const express = require("express");
const Listing = require("./models/Listing");
const Review = require("./models/Review");

module.exports.isLoggedIn= (req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing/editing/delete/update");
        return res.redirect("/users/login");
    }
     next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl) {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async(req,res,next)=>{
    let {id} =req.params;
    let listing = await Listing.findById(id); 
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,review_id} =req.params;
    let listing = await Listing.findById(id); 
    let review=await Review.findById(review_id);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Author of review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}