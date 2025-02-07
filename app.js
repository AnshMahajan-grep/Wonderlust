const express=require("express");
const app =express();
const port=8080;
const path =require("path");
const mongoose=require("mongoose");
const Listing =require("./models/listing.js");
const methodOverride= require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError =require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js")
const Review =require("./models/review.js");


app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");
app.engine("ejs" ,ejsMate);
app.set("views",path.join(__dirname,"views"));
app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
main()
    .then(() => {
    console.log("connection  successful");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


app.listen(port ,()=>{
    console.log(`app is listening on ${port}`);
});

app.get("/",(req,res)=>{
    res.send("Hi I am the root");
})

const validateListing =(req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
    if(error){
        let errMsg =error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404,error);
    }else{
        next();
    }
}
const validateReview =(req,res,next)=>{
    let {error} =reviewSchema.validate(req.body);
    if(error){
        let errMsg =error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404,error);
    }else{
        next();
    }
}

app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings =await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}))

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});

}))
app.post("/listings",validateListing, wrapAsync(async (req,res,next)=>{
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings"); 
}));

app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}))

app.put("/listings/:id", validateListing ,wrapAsync(async (req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndUpdate(id,req.body.listing);
    res.redirect("/listings");
}))

app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))
app.post("/listings/:id/review",validateReview ,wrapAsync(async(req,res)=>{
    let {id} =req.params;
    const listing =await Listing.findById(id);
    let review =new Review(req.body.review);
    listing.reviews.push(review);

    await review.save();
    await listing.save(); 
    res.redirect(`/listings/${id}`);

}))
app.delete("/listings/:id/review/:reviewId" ,wrapAsync(async (req,res)=>{
    let {id ,reviewId} =req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500 , message="Something went wrong!"} =err;
    res.status(statusCode).render("error.ejs",{message});

    // res.status(statusCode).send(message);   
})




// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });