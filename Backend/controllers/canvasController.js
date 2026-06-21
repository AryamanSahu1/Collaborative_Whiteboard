const Canvas=require('../models/canvasModel');

//Get all canvases for user
const getAllCanvases=async(req,res)=>{
    const email=req.email;
    try{
        const canvases=await Canvas.getAllCanvases(email);
        return res.status(200).json(canvases);
    }catch(error){
        return res.status(400).json({message: error.message});
    }
}

//load canvas
const loadCanvas=async(req,res)=>{
    try{
        const canvasId=req.params.id;

        const canvas=await Canvas.loadCanvas(canvasId,req.email);
        return res.status(200).json(canvas);
    }catch(error){
        return res.status(400).json({message: error.message});
    }
}

//Create canvas for a given user
const createCanvas=async(req,res)=>{

    const email=req.email;
    const {name}=req.body;
    try{
        const newCanvas=await Canvas.createCanvas(email,name);
        res.status(201).json(newCanvas);
    }
    catch(error){
        res.status(400).json({message: error.message});
    }
}

//Update Canvas
const updateCanvas = async (req, res) => {
    try {
        const canvasId = req.params.id;
        const email = req.email;
        const { elements } = req.body;

        const updatedCanvas = await Canvas.updateCanvas(
            canvasId,
            email,
            elements
        );

        return res.status(200).json(updatedCanvas);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

//Delete Canvas
const deleteCanvas = async (req, res) => {
    try {
        const canvasId = req.params.id;
        const email = req.email;

        const result = await Canvas.deleteCanvas(canvasId, email);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

//Share the canvas with user using email
const shareCanvas = async (req, res) => {
    try {
        const email = req.email;
        const canvasId = req.params.id;
        const { sharedwithEmail } = req.body;

        if (!sharedwithEmail) {
            return res.status(400).json({
                message: "Shared user email is required",
            });
        }

        const updatedCanvas = await Canvas.shareCanvas(
            email,
            canvasId,
            sharedwithEmail
        );

        return res.status(200).json({
            success: true,
            message: "Canvas shared successfully",
            canvas: updatedCanvas,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports={
    getAllCanvases,
    createCanvas,
    loadCanvas,
    updateCanvas,
    deleteCanvas,
    shareCanvas
};
