import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    date: Date,
    hashtags: [{type: String}],
    meta: {
        like: Number,
        view: Number,
    },
});

const VideoDBModel = mongoose.model("Video", videoSchema);
export default VideoDBModel;