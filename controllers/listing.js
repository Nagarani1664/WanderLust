const Listing=require("../models/Listing.js");

module.exports.index=async (req,res)=>{
    let allListings;
    if(req.query.search && req.query.search.trim()!=""){
      let name=req.query.search;
      allListings = await Listing.find({
        country : { $regex:name,$options:"i" },
      });
    }

    
    else if(req.query.category && req.query.category.trim()!=""){
      let cate=req.query.category;
      allListings=await Listing.find({
        category : cate,
      });
    }
    else {
      allListings = await Listing.find({});
    }
      res.render("Listings/index.ejs",{allListings});     
}

module.exports.new=async(req,res)=>{
   console.log(req.user);
    res.render("Listings/new.ejs");
}
module.exports.show=( async (req,res)=>{
  let {id} =req.params;
 const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  })
  .populate("owner");
 console.log(listing);
 if(!listing){
    req.flash("error","Listing you requested does not exit" );
    return res.redirect("/listings"); //vvry imp
 }
  
  res.render("Listings/show.ejs",{listing,});
})
module.exports.newlisting = async (req, res) => {

  // create listing first
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;

  // ✅ geocoding function
  async function getCoords(place) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${place}`,
      {
        headers: {
          "User-Agent": "wanderlust-app"
        }
      }
    );

    const data = await res.json();

    if (!data.length) {
      throw new Error("Invalid location");
    }

    return [data[0].lon, data[0].lat]; // [lng, lat]
  }

  // ✅ call function HERE
  const coords = await getCoords(req.body.listing.location);

  // ✅ save geometry (GeoJSON)
  newlisting.geometry = {
    type: "Point",
    coordinates: coords
  };

  // console.log(coords);

  // image
  if(!req.file){
   req.flash("error","Please upload an image");
   return res.redirect("/listings/new");
}
  let url = req.file.path;
  let filename = req.file.filename;
  newlisting.image = { url, filename };
  console.log(newlisting);

  await newlisting.save();

  req.flash("success", "New listing added");
  res.redirect("/listings");
};

module.exports.edit=async (req,res)=>{
 let {id} =req.params;
 const listing=await Listing.findById(id);
 if(!listing){
  req.flash("error","Listing you requested for does not exist");
  return res.redirect("/listings");
 }
 let originalimageurl=listing.image.url;
 originalimageurl=originalimageurl.replace("/upload","/upload/h_300,w_250")
 res.render("Listings/edit.ejs",{listing,originalimageurl});
}
module.exports.update=async(req,res)=>{
  let {id} =req.params;
  let listing= await Listing.findById(id);
  // console.log(listing);

  let {title,description,price,location,country}=req.body.listing;
  await Listing.findByIdAndUpdate(id, {title,description,price,location,country});
  if(typeof req.file !="undefined" ){
     let url=req.file.path;
     let filename=req.file.filename;
     listing.image={url,filename}
     await listing.save();
  }
   req.flash("success", "Listing updated successfully");
   res.redirect(`/listings/${id}`);
//   console.log({title,description,price,location,country});
}
module.exports.destroyRoute=async (req,res)=>{
let {id} =req.params;

let listing= await Listing.findByIdAndDelete(id);
req.flash("success","Deleted Successfully");
res.redirect("/listings");
}