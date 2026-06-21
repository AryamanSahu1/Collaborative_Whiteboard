const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    console.log("user request");
    res.send("This is a server response");
    // res.send(res.customData + "This is a server response");
});
router.post('/',(req,res)=>{
    res.send("Got a POST req");
});

// Export router
module.exports=router;  