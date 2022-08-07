import { deleteCommentByFilter, findCommentByFilter, saveComment } from "../dao/commentDAO";
import CommentDTO from "../dto/commentDTO";



export const addComment = async (message, userId, videoId) => {
    const commentDTO = new CommentDTO();
    commentDTO.message = message;
    commentDTO.owner = userId;
    commentDTO.video = videoId;
    const commentDBModel = await saveComment(commentDTO.toCommentDBModel());
    if(commentDBModel){
        return new CommentDTO(commentDBModel);
    }
    return undefined;
}

export const getComments = async (comments) => {
    const commentDTOs = [];
    const COMMENT_LIMIT = 20;
    const startIdx = comments.length < COMMENT_LIMIT ? 0 : comments.length - COMMENT_LIMIT;

    for(let i = comments.length-1; i >= startIdx; i--){
        const filter = {_id: comments[i]};
        const commentDBModel = await findCommentByFilter(filter, true);
        commentDTOs.push(new CommentDTO(commentDBModel));
    }
    // commentDTOs.sort((commentDTO1, commentDTO2) => {
    //     return commentDTO2.date - commentDTO1.date;
    // });

    return commentDTOs;
}

export const getComment = async (_id) => {
    const filter = {_id};
    const commentDBModel = await findCommentByFilter(filter, true);
    if(commentDBModel)
        return new CommentDTO(commentDBModel);
    return undefined;
}

export const deleteComment = async (_id) => {
    const filter = {_id};
    const commentDBModel = await deleteCommentByFilter(filter, false);
    if(commentDBModel){
        return new CommentDTO(commentDBModel);
    }
    return undefined;
}