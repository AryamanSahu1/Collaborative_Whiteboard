const mongoose = require("mongoose");

const canvasSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: "Untitled Canvas",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    elements: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    shared_with: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Get all canvas for a user (both owner and sharedWith)

canvasSchema.statics.getAllCanvases=async function(email){
    const user=await mongoose.model('Users').findOne({email});
    try{
        if(!user){
            return Error('User not found');
        }
        const canvases=await this.find({$or: [{owner: user._id},{shared_with: user._id}]}).sort({createdAt: -1});
        return canvases;
    } catch(error){
        return Error('Error getting canvases');
    }
};

//load canvas
canvasSchema.statics.loadCanvas=async function(canvasId,email){
    const user=await mongoose.model("Users").findOne({email});

    if(!user){
        throw new Error("User not found");
    }
    const canvas=await this.findById(canvasId);

    if(!canvas){
        throw new Error("Canvas not found");
    }
    const isOwner=canvas.owner.toString()===user._id.toString();

    const isShared=canvas.shared_with.some((id)=>id.toString()=== user._id.toString());

    if(!isOwner && !isShared){
        throw new Error(
            "Unauthorized to access this canvas"
        );
    }

    return canvas;
}

//Update Canvas
canvasSchema.statics.updateCanvas=async function(canvasId,email,elements){
    const user=await mongoose.model('Users').findOne({email});

    if(!user){
        throw new Error("User not found");
    }
    const canvas=await this.findById(canvasId);
    if(!canvas){
        throw new Error("Canvas not found");
    }

    const isOwner=canvas.owner.toString()===user._id.toString();
    const isShared=canvas.shared_with.some(
        (id)=>id.toString()===user._id.toString()
    );
    if(!isOwner && !isShared){
        throw new Error(
            "Unauthorized to update this canvas"
        );
    }

    canvas.elements=elements;
    await canvas.save();
    return canvas;
};



//Create a canvas for a user with given email
canvasSchema.statics.createCanvas=async function(email,name){
    const user=await mongoose.model('Users').findOne({email});
    try{
        if(!user){
            return Error("User not found");
        }

        const canvas=new this({
            owner: user._id,
            name,
            elements: [],
            shared_with: [],
        });
        const newCanvas=await canvas.save();
        return newCanvas;
    }catch(error){
        return Error('Error creating canvas');
    }
}

//Delete Canvas
canvasSchema.statics.deleteCanvas = async function (canvasId, email) {
    const User = mongoose.model("Users");

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    const canvas = await this.findById(canvasId);

    if (!canvas) {
        throw new Error("Canvas not found");
    }

    if (canvas.owner.toString() !== user._id.toString()) {
        throw new Error("Only the owner can delete this canvas");
    }

    await this.findByIdAndDelete(canvasId);

    return { message: "Canvas deleted successfully" };
};

//Add email to shared_with array of canvas
canvasSchema.statics.shareCanvas=async function(email,canvasId,sharedwithEmail){
    const user=await mongoose.model('Users').findOne({email});
    const sharedWithUser=await mongoose.model('Users').findOne({email: sharedwithEmail});
    try{
        if(!user || !sharedWithUser){
            throw new Error('User not found');
        }
        const canvas= await this.findOne({_id: canvasId, owner:user._id});
        if(!canvas){
            throw new Error('Canvas not found');
        }

        canvas.shared_with.push(sharedWithUser._id);
        const updatedCanvas=await canvas.save();
        return updatedCanvas;
    }catch(error){
        throw error;
    }
}

const Canvas = mongoose.model("Canvas", canvasSchema);
module.exports=Canvas;