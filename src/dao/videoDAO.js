import VideoDBModel from "../db/videoDBModel";

export const findAllVideos = async (needOwner) => {
    if(needOwner)
        return await VideoDBModel.find({}).populate("owner").sort({date:"desc"});
    return await VideoDBModel.find({}).sort({date:"desc"});
}

export const findVideosByFilter = async (filter, needOwner) => {
    if(needOwner)
        return await VideoDBModel.find(filter).populate("owner").sort({date:"desc"});
    return await VideoDBModel.find(filter).sort({date:"desc"});
}

export const findVideoById = async (_id, needOwner) => {
    if(needOwner)
        return await VideoDBModel.findById(_id).populate("owner");
    return await VideoDBModel.findById(_id);
}

export const saveVideo = async (videoDBModel, needOwner) => {
    const savedVideo = await videoDBModel.save();
    if(needOwner){
        return await findVideoById(savedVideo._id, needOwner);
    }
    return savedVideo;
}

export const findOneByFilterAndUpdate = async (filter, update, needOwner) => {
    if(needOwner)
        return await VideoDBModel.findOneAndUpdate(filter, update, {new: true}).populate('owner');
    return await VideoDBModel.findOneAndUpdate(filter, update, {new: true});
}

export const findOneByIdAndDelete = async (_id) => {
    return await VideoDBModel.findByIdAndDelete(_id);
}