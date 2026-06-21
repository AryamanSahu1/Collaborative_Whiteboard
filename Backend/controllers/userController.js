const userModel=require('../models/userModel');
const jwt = require('jsonwebtoken');
const JWT_SECRET=process.env.JWT_SECRET;

const registerUser=async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        const newUser=await userModel.register(name,email,password);
        res.status(201).json(newUser);
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await userModel.login(email, password);

        const token = jwt.sign(
            {email: user.email},
            JWT_SECRET,
        );

        return res.status(200).json({
            message: "Login successful",
            token,
        });
    } catch (error) { 
        return res.status(400).json({
            message: error.message
        }); 
    }
};


const getUserProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization token required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );
        if(!decoded || !decoded.email){
            return res.status(401).json({message: 'Invalid token'});
        }
        const user = await userModel.getUser(decoded.email);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(401).json({
            message: error.message
        });
    }
};

module.exports={
    registerUser,
    loginUser,
    getUserProfile
}