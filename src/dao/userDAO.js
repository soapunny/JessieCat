import UserDBModel from "../db/userDBModel";

export const saveUser = async (userDBModel, needAllInfo) => {
    const savedUser = await userDBModel.save();
    if(needAllInfo){
        return await findUserById(savedUser._id, needAllInfo);
    }
    return savedUser;
}

export const findUserById = async(_id, needAllInfo) => {
    if(needAllInfo)
        return await UserDBModel.findById(_id).populate('comments').populate('likes').populate('videos').populate('status');

    return await UserDBModel.findById(_id);
}

export const findUserByFilter = async (filter, needAllInfo) => {
    if(needAllInfo)
        return await UserDBModel.findOne(filter).populate('comments').populate('likes').populate('videos').populate('status');

    return await UserDBModel.findOne(filter);
}

export const findUserByEmailAndPassword = async (email, password, needAllInfo) => {
    const userDBModel = await findUserByFilter({email}, needAllInfo);
    
    if(userDBModel){
        const isSame = await UserDBModel.comparePassword(password, userDBModel.password);
        if(isSame)
            return userDBModel;
    }
    return undefined;
}

export const findUserByFilterAndUpdate = async (filter, update, needAllInfo) => {
    if(needAllInfo){
        return await UserDBModel.findOneAndUpdate(filter, update, {new: true}).populate('comments').populate('likes').populate('videos').populate('status');
    }
    return await UserDBModel.findOneAndUpdate(filter, update, {new: true});
}

export const doesIdExist = async (_id, needAllInfo) => {
    if(needAllInfo){
        return await UserDBModel.exists({_id}).populate('comments').populate('likes').populate('videos').populate('status');
    }
    return await UserDBModel.exists({_id});
}

export const doesEmailExist = async (email, needAllInfo) => {
    if(needAllInfo){
        return await UserDBModel.exists({email}).populate('comments').populate('likes').populate('videos').populate('status');
    }
    return await UserDBModel.exists({email});
}

export const doesUsernameExist = async (username, needAllInfo) => {
    if(needAllInfo)
        return await UserDBModel.exists({username}).populate('comments').populate('likes').populate('videos').populate('status');
    return await UserDBModel.exists({username});
}

export const saveVideosInUser = async (userId, videoId, needAllInfo) => {
    const user = await UserDBModel.findById(userId);
    user.videos.push(videoId);
    return await saveUser(user, needAllInfo);
}

export const removeVideoInUser = async (userId, videoId, needAllInfo) => {
    const user = await UserDBModel.findById(userId);
    user.videos = user.videos.filter(video => {
        return String(video) !== videoId;
    });
    return await saveUser(user, needAllInfo);
}

export const deleteUserbyEmail = async (email) => {
    return await UserDBModel.deleteOne({email});
}

export const saveCommentInUser = async (userId, commentId, needAllInfo) => {
    const userDBModel = await findUserByFilter({userId}, false);
    if(userDBModel){
        userDBModel.comments.push(commentId);
        return saveUser(userDBModel, needAllInfo);
    }
    return undefined;
}

export const deleteCommentInUser = async (userId, commentId, needAllInfo) => {
    const user = await UserDBModel.findById(userId);
    if(user){
        user.comments = user.comments.filter(comment => {
            return String(comment) !== commentId;
        });
        return await saveUser(user, needAllInfo);
    }
    return undefined;
}

//TODO save().populate is not available need to change them.