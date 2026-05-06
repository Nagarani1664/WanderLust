const express=require("express");
const app=express();
const port = 3000;
const session=require("express-session");
const flash = require("connect-flash");
const path=require("path");
const sessionOptions ={
    secret : "mysupersecrete",
    resave : false,
    saveUninitialized: true
}
app.use(session( sessionOptions));
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.get("/reqCount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }
    else {
        req.session.count=1;
    }
    res.send(`You sent a request ${req.session.count} times`);
})
app.use((req,res,next)=>{
    res.locals.SuccessMsg = req.flash("Success");
    res.locals.errMsg=req.flash("error");
    next();
})
app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name=="anonymous") {
        req.flash("error","User not registered");
    }
    else{
        req.flash("Success" ,"user registered successfully");
    }
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name : req.session.name} );
})
app.get("/test",(req,res)=>{
    res.send("Testing");
})
app.listen(port,()=>{
    console.log(`Listening to ${port}`);
})