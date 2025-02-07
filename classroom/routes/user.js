const express=require("express");
const router= express.Router();
//users
router.get("/",(req,res)=>{
    res.send("GET for users");
});
router.get("/:id" ,(req,res)=>{
    res.send(`GET for show users`);
})

router.post("/",(req,res)=>{
    res.send(`POST for users`);
})
router.delete("/",(req,res)=>{
    res.send(`DELETE for users`);
})
module.exports=router;