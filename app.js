if(process.env.NODE_ENV!="production"){
require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=8080;
const Listing=require("./models/Listing.js");
const Review = require("./models/Review.js");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const path=require("path");
const session=require("express-session");
const  MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy = require("passport-local");

const listingRouter = require("./routers/listings.js");
const reviewRouter=require("./routers/reviews.js");
const userRouter=require("./routers/user.js");
const { error } = require('console');


let atlaurl=process.env.ATLASURL;

main() .then(()=>{
    console.log("Connection successful");
}) .catch((err)=>{
    console.log(err);
})

async function main() {
     await mongoose.connect(atlaurl);
}

app.engine('ejs',ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const store = MongoStore.create({
    mongoUrl: atlaurl,
    
    secret : process.env.SECRET,

    touchAfter:24*3600,
});
store.on('error',(err)=>{
    console.log("erroe in mongoose",err);
});

const sessionOptions = {
    store,
    secret :process.env.SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie : {
      expires : Date.now() + 7 * 24 * 60 * 60*1000,
      maxAge : 7 * 24 * 60 * 60 *1000,
      httpOnly : true


    }
}
app.use(session(sessionOptions));
app.use(flash());
// app.get("/testListing",async (req,res)=>{
//    let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//    });

//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful testing");

// });
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/",(req,res)=>{
//     res.send("Hi I am root");
// });
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});
// app.get("/demoUser",async(req,res)=>{
//     let fakeUser = new User({
//         email : "veda@gmail.com",
//         username : "veda",
//     });
//     let registeredUser= await User.register(fakeUser,"veda@1664");
//     res.send(registeredUser);
// });



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/users",userRouter);

app.use((err, req, res, next) => {

    let { statusCode = 500, message = "Something went wrong" } = err;

    if (res.headersSent) {
        return next(err);
    }

    res.status(statusCode).render("Listings/error.ejs", { err });

});
app.listen(port,()=>{
   console.log (`Listenig to '${port}'`);
});

