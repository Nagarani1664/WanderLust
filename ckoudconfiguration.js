const cloudinary=require("cloudinary").v2;
const {CloudinaryStorage}=require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key:process.env.cloud_api_key,
    api_secret:process.env.cloud_api_secret
});

//define storage

const storage=new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder : "wanderLust_Dev",
        allowedFormats:["png","jpeg","jpg"]
    },
});

module.exports={
    cloudinary,
    storage
}