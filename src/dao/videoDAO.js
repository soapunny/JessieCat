import VideoDBModel from "../db/videoDBModel";

export const findHomeVideos = async () => {
    return await VideoDBModel.find({}).populate("owner").populate("likes").sort({date:"desc"});
}

export const findVideoById = async (_id, needAllInfo) => {
    if(needAllInfo)
        return await VideoDBModel.findById(_id).populate("owner").populate("likes");
    return await VideoDBModel.findById(_id);
}

export const findVideosByFilter = async (filter, needAllInfo) => {
    if(needAllInfo)
        return await VideoDBModel.find(filter).populate("owner").populate("likes").sort({date:"desc"});
    return await VideoDBModel.find(filter).sort({date:"desc"});
}

export const saveVideo = async (videoDBModel, needAllInfo) => {
    const savedVideo = await videoDBModel.save();
    if(needAllInfo){
        return await findVideoById(savedVideo._id, needAllInfo);
    }
    return savedVideo;
}

export const findOneByFilterAndUpdate = async (filter, update, needAllInfo) => {
    if(needAllInfo)
        return await VideoDBModel.findOneAndUpdate(filter, update, {new: true}).populate("owner").populate("likes");
    return await VideoDBModel.findOneAndUpdate(filter, update, {new: true});
}

export const findOneByIdAndDelete = async (_id) => {
    return await VideoDBModel.findByIdAndDelete(_id);
}

export const saveCommentInVideo = async (_id, commentId, needAllInfo) => {
    const videoDBModel = await findVideoById(_id, false);
    if(videoDBModel){
        videoDBModel.comments.push(commentId);
        return saveVideo(videoDBModel, needAllInfo);
    }
    return undefined;
}

export const deleteCommentInVideo = async (videoId, commentId, needAllInfo) => {
    const video = await VideoDBModel.findById(videoId);
    if(video){
        video.comments = video.comments.filter(comment => {
            return String(comment) !== commentId;
        });
        return await saveVideo(video, needAllInfo);
    }
    return undefined;
}