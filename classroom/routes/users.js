const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("GET for users");
});
//show 
router.get("/:id",(req,res)=>{
    res.send("GET for user id");
});
//new user post 
router.post("/",(req,res)=>{
    res.send("POST for users");
});
//delete 
router.delete("/:id",(req,res)=>{
    res.send("DELETE for user id");
});

module.exports=router;