import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, trim: true, ref: 'User'},
    video: {type: mongoose.Schema.Types.ObjectId, required: true, trim: true, ref: 'Video'},
    date: {type: Date, required: true, default: Date.now },
});

const LikeDBModel = mongoose.model('Like', likeSchema);

export default LikeDBModel;