import CommentDBModel from "../db/commentDBModel"


export const saveComment = async (commentDBModel) => {
    return await commentDBModel.save();
}

export const findCommentByFilter = async (filter, needAllInfo) => {
    if(needAllInfo)
        return CommentDBModel.findOne(filter).populate('owner').populate('video');
    return CommentDBModel.findOne(filter);
}

export const deleteCommentByFilter = async (filter, needAllInfo) => {
    if(needAllInfo)
        return CommentDBModel.deleteOne(filter).populate('owner').populate('video');
    return CommentDBModel.deleteOne(filter);
}