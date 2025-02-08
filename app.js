const express=require("express");
const app =express();
const port=8080;
const path =require("path");
const mongoose=require("mongoose");
const methodOverride= require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError =require("./utils/ExpressError.js");
const session =require("express-session");
const flash =require("connect-flash"); 

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

const sessionOptions ={
    secret : "mysupersecretstring", 
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now +7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};
app.get("/",(req,res)=>{
    res.send("Hi I am the root");
})

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success =req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/listings",listings);
app.use("/listings/:id/review",reviews);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500 , message="Something went wrong!"} =err;
    res.status(statusCode).render("error.ejs",{message});

    // res.status(statusCode).send(message);
})