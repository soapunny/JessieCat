import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    message: {type:String, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, trim: true, ref: 'User'},
    video: {type: mongoose.Schema.Types.ObjectId, required: true, trim: true, ref: 'Video'},
    date: {type: Date, required: true, default: Date.now },
});

const CommentDBModel = mongoose.model('Comment', commentSchema);

export default CommentDBModel;