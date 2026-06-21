const express=require('express');

const {getAllCanvases,createCanvas,loadCanvas,updateCanvas,deleteCanvas,shareCanvas}=require('../controllers/canvasController');
const authMiddleware=require('../middlewares/authenticationmiddleware');
const router=express.Router();

router.get('/',authMiddleware,getAllCanvases);
router.get("/load/:id",authMiddleware,loadCanvas);
router.post('/',authMiddleware,createCanvas);

//update Canvas
router.put('/:id',authMiddleware,updateCanvas);

//Delete Canvas
router.delete('/:id',authMiddleware,deleteCanvas);

//share Canvas
router.put('/share/:id',authMiddleware,shareCanvas);
module.exports=router;
