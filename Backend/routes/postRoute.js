const express=require('express');
const {createPost,getPosts}=require('../controllers/postController');
const router=express.Router();

router.get('/',(req,res)=>{
    getPosts(req,res);
});
router.post('/',(req,res)=>{
    createPost(req,res);
});


// Export router
module.exports=router;  