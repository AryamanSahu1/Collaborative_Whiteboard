const mongoose=require('mongoose');

const postsSchema=new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        maxLength: 200
    },
    content:{
        type: String,
        required: true,
        trim: true
    },
    numberOfLikes:{
        type: Number,
        default: 0
    },

}, {
    timestamps: true,
    collection: 'test'
});

postsSchema.statics.createPost=async function(title,content){
    try{
        const post= new this({
            title,
            content
        });
        const newPost= await post.save();
        return newPost;
    }catch(error){
        throw new Error('Error creating posts: '+error.message);
    }
}

postsSchema.statics.getPosts=async function(){
    try{
        const posts= await this.find();
        return posts;
    } catch(error){
        throw new Error('Error getting posts: '+error.message);
    }
}

const postsModel=mongoose.model('Posts',postsSchema);

module.exports=postsModel;