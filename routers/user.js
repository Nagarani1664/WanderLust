const express=require("express");
const router=express.Router();
const wrapAsync=require("../util/wrapAysnc.js");
const ExpressError=require("../util/ExpressError.js");
const passport=require("passport");
const userController=require("../controllers/user.js");
let  User=require("../models/user.js");
let {saveRedirectUrl}=require("../middleware.js");
router
.route("/signUp")
.get(userController.signup)
.post(wrapAsync(userController.postsignup));
router
.route("/login")
.get(userController.login)
.post(saveRedirectUrl,
    passport.authenticate('local',
    {failureRedirect :"/users/login",failureFlash:  true}),
   wrapAsync(  userController.postlogin)

);
router.get("/logout",userController.logout);
module.exports=router;
