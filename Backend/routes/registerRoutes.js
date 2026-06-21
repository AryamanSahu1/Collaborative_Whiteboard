const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    console.log("Recieved a request on register route ");
    const sampleData={
        message: "Hii welcome to register route"
    }
    res.json(sampleData);
});

module.exports=router;