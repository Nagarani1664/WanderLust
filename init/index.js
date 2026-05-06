const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/Listing.js");

main() .then(()=>{
    console.log("Successful connection");
}) .catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({
        ...obj,
        owner : "69e9e9a7d2799453fd85a578",
    })) 
    await Listing.insertMany(initData.data);
    console.log("Data was initilized");
}

initDB();