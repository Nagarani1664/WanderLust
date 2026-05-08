const express=require("express");
const router=express.Router();
const Listing=require("../models/Listing.js");
const wrapAsync=require("../util/wrapAysnc.js");
const ExpressError=require("../util/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const {isLoggedIn, isOwner}=require("../middleware.js");
const User =require("../models/user.js"); 
const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../ckoudconfiguration.js");
const upload = multer({storage})

const validateListing = (req, res, next) => {

    let result = listingSchema.validate(req.body);

    console.log(req.body);
    console.log(result);
    if(result.error){
        return res.send(result.error.details[0].message);
    }

    next();
}
router.get("/new",isLoggedIn,listingController.new);

router.get("/wishlist",isLoggedIn,wrapAsync(async(req,res)=>{
   let user=await User.findById(req.user._id).populate("wishlist");

   res.render("Listings/wishlist",{user});
}))
router.post("/wishlist/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id} =req.params;
    let listing= await Listing.findById(id)
    let user=await User.findById(req.user._id);
    let alreadySaved = false;
      for (let item of user.wishlist) {
        if (item.toString() === listing._id.toString()) {
            alreadySaved = true;
            break;
        }
    }

    // add only if not already saved
    if (!alreadySaved) {
        user.wishlist.push(listing._id);
    }
    await user.save();
    res.redirect(`/listings/${id}`);
}));
router.delete("/wishlist/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;//listing id
    let user=await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(item => 
        item.toString() !== id);
    await user.save();

    res.redirect("/listings/wishlist");
    
}));
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.edit));
//index
router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync (listingController.newlisting));
// .post(upload.single("listing[image]"),(req,res)=>{
// 
    // res.send(req.file);
// })

router
.route("/:id")
.get(isLoggedIn,wrapAsync(listingController.show))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.update))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyRoute));
//new 
//show

module.exports=router;