const express=require("express");
const app =express();
const flash =require("connect-flash");
const port=3000;
const users =require("./routes/user.js");
const posts=require("./routes/post.js");
const session =require("express-session");
app.set("view engine","ejs");
const path =require("path");
app.set("views",path.join(__dirname,"views"));

app.listen(port ,()=>{
    console.log(`app is listening on port ${port}`);
})
const sessionOptions ={
    secret : "mysupersecretstring" , 
    resave:false,
    saveUninitialized:true,
};
app.use(session(sessionOptions));
app.use(flash());

app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    req.session.name=name;
    if(name=="anonymous"){
        req.flash("error","user not registered ");
    }else{
        req.flash("success","user registered successfully!");
    }
    res.redirect("/hello");
});
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/hello" ,(req,res)=>{
    res.render("page.ejs", {name:req.session.name}); 
})

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`You send a req ${req.session.count} times`);
// })
// app.get("/test",(req,res)=>{
//     res.send("test successful");
// })



// const cookieParser =require("cookie-parser");
// app.use(cookieParser("secretcode"));

// app.get("/getcookies",(req,res)=>{
//     res.cookie("great","hello");
//     res.send("sent you some cookies");
// })

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send(`signed cookie sent`);
// })
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send(`verifies`);
// })
// app.get("/greet",(req,res)=>{
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi, ${name}`);
// })

// app.get("/" ,(req,res)=>{
//     console.dir(req.cookies);
//     res.send(`Hi ,I am the root`);
// });

// app.use("/users",users);
// app.use("/posts",posts);