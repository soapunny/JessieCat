import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    videoUrl: {type: String, required: true, trim: true},
    thumbUrl: {type: String, required: true, trim: true},
    title: {type: String, required: true, trim: true, maxLength: 80},
    description: {type: String, trim: true, maxLength: 200},
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, trim: true, ref: 'User'},
    date: {type: Date, required: true, default: Date.now },
    hashtags: [{type: String, trim: true}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Like'}],
    view: {type: Number, required: true, default: 0},
});

//middleware
videoSchema.pre('save', async function(){
    //console.log(this);
});

const VideoDBModel = mongoose.model("Video", videoSchema);
export default VideoDBModel;