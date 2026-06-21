const mongoose = require('mongoose');
const { eventNames } = require('./models/canvasModel');
const url= process.env.MONGO_URL;

const connectToDatabase=async()=>{
    try{
        await mongoose.connect(url);
        console.log('Connected to the database');
        
    } catch(error){
        console.error(`Error connecting to the database: ${error}`);
    }
};

module.exports=connectToDatabase;
