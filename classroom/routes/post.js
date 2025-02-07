const express=require("express");
const router=express.Router();
//posts
router.get("/",(req,res)=>{
    res.send("GET for posts");
})
router.get("/:id" ,(req,res)=>{
    res.send(`GET for show posts`);
})

router.post("/",(req,res)=>{
    res.send(`POST for posts`);
})
router.delete("/",(req,res)=>{
    res.send(`DELETE for posts`);
})
module.exports=router;
