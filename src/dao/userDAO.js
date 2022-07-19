import UserDBModel from "../db/userDBModel";

export const saveUser = async (userDBModel, needVideos) => {
    const savedUser = await userDBModel.save();
    if(needVideos){
        return await findUserById(savedUser._id, needVideos);
    }
    return savedUser;
}

export const findUserById = async(_id, needVideos) => {
    if(needVideos)
        return await UserDBModel.findById(_id).populate('videos');

    return await UserDBModel.findById(_id);
}

export const findUserByFilter = async (filter, needVideos) => {
    if(needVideos)
        return await UserDBModel.findOne(filter).populate('videos');

    return await UserDBModel.findOne(filter);
}

export const findUserByEmailAndPassword = async (email, password, needVideos) => {
    const userDBModel = await findUserByFilter({email}, needVideos);
    
    if(userDBModel){
        const isSame = await UserDBModel.comparePassword(password, userDBModel.password);
        if(isSame)
            return userDBModel;
    }
    return undefined;
}

export const findUserByFilterAndUpdate = async (filter, update, needVideos) => {
    if(needVideos){
        return await UserDBModel.findOneAndUpdate(filter, update, {new: true}).populate('videos');
    }
    return await UserDBModel.findOneAndUpdate(filter, update, {new: true});
}


export const doesEmailExist = async (email, needVideos) => {
    if(needVideos){
        return await UserDBModel.exists({email}).populate('videos');
    }
    return await UserDBModel.exists({email});
}

export const doesUsernameExist = async (username, needVideos) => {
    if(needVideos)
        return await UserDBModel.exists({username}).populate('videos');
    return await UserDBModel.exists({username});
}

export const saveVideosInUser = async (userId, videoId, needVideos) => {
    const user = await UserDBModel.findById(userId);
    user.videos.push(videoId);
    return await saveUser(user, needVideos);
}

export const removeVideoInUser = async (userId, videoId, needVideos) => {
    const user = await UserDBModel.findById(userId);
    user.videos = user.videos.filter(video => {
        return String(video) !== videoId;
    });
    return await saveUser(user, needVideos);
}

//TODO save().populate is not available need to change them.