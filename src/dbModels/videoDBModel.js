import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    id: String,
    title: {type: String, required: true, trim: true, maxLength: 80},
    description: {type: String, trim: true, maxLength: 200},
    date: {type: Date, required: true, default: Date.now },
    hashtags: [{type: String, trim: true}],
    meta: {
        like: {type: Number, required: true, default: 0},
        view: {type: Number, required: true, default: 0},
    },
});

//middleware
videoSchema.pre('save', async function(){
    //console.log(this);
});

//static method
videoSchema.static("getFilterById", (id) => {
    return {_id: id};
});

const VideoDBModel = mongoose.model("Video", videoSchema);
export default VideoDBModel;