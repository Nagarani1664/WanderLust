const Listing=require("../models/Listing");
const Review=require("../models/Review")
const User=require("../models/user");

module.exports.signup=async(req,res)=>{
    res.render("users/signup");
}
module.exports.postsignup=async (req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        const newUser =new User ({username,email});
        // console.log(newUser);
        let registedUser= await User.register(newUser,password);
        req.login(registedUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to wanderLust");
              return res.redirect("/listings"); 
        });
    
    }
    catch(error){
        req.flash("error",error.message);
        return res.redirect("/users/signUp");
    }
}
module.exports.login =(req,res)=>{
  res.render("users/login.ejs");
}

module.exports.postlogin=async(req,res)=>{
    req.flash("success","Welcome back to WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl); 
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out Successfully");
        res.redirect("/listings");
    });
    // console.log(req.user);
};