const express=require("express");
const app=express();
const users=require("./routes/users");
const posts=require("./routes/posts");
const cookieParser=require("cookie-parser");
const port=3000;
app.use(cookieParser("secretcode"));

app.use("/users",users);
app.use("/posts",posts);
app.get("/setsigned",(req,res)=>{
    res.cookie("MadeIn","India" ,{signed: true});
    res.cookie("color","red");
    res.send("set cookie");
});
app.get("/verify",(req,res)=>{
  console.log(req.signedCookies);
  res.send("verified");
});
app.get("/setcookies",(req,res)=>{
  res.cookie("greet" , "namaste");
  res.cookie("name","Nagarani");
  console.log("saved cookie");
  res.send("saved");
});
app.get("/" ,(req,res)=>{
    console.log(req.cookies);
    res.send(`Hi I am ${req.cookies.name}`);
})

app.listen(port,()=>{
    console.log(`Listening to ${port}`); 
})