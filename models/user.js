const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const Schema = mongoose.Schema;
//const passportLocalMongoose=require("passport-local-mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");

const userSchema = new Schema({
    email :{
        type : String,
        required : true,
    },
    wishlist:[
        {
        type:Schema.Types.ObjectId,
        ref:"Listing"
        }
        
    ]
});
console.log(typeof passportLocalMongoose);
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User",userSchema);
module.exports=User;