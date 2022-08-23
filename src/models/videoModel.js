import VideoDTO from "../dto/videoDTO";
import FormatUtil from "../utils/formatUtil";
import {findHomeVideos, findRandomVideos, findVideosByFilter, findVideoById, saveVideo, findOneByFilterAndUpdate, findOneByIdAndDelete, saveCommentInVideo, deleteCommentInVideo} from "../dao/videoDAO";
import CommentDTO from "../dto/commentDTO";

export const getHomeVideos = async () => {
    const videos = await findHomeVideos();
    if(videos){
        const videoDTOs = [];
        for(let i=0;i<videos.length;i++){
            videoDTOs.push(new VideoDTO(videos[i]));
        }
        return videoDTOs;
    }
    return undefined;
}

export const getRandomVideos = async () => {
    const videos = await findRandomVideos();
    if(videos){
        const videoDTOs = [];
        for(let i=0;i<videos.length;i++){
            videoDTOs.push(new VideoDTO(videos[i]));
        }
        return videoDTOs;
    }
    return undefined;
}

export const getVideoToWatch = async (_id) => {
    const videoDBModel = await findVideoById(_id, true);
    if(videoDBModel){
        return new VideoDTO(videoDBModel);
    }
    return undefined;
}

export const getVideo = async (_id) => {
    const videoDBModel = await findVideoById(_id, false);
    if(videoDBModel)
        return new VideoDTO(videoDBModel);
    return undefined;
}

export const getVideosByOwner = async (owner, needOwner) => {
    const videos = await findVideosByFilter({owner}, needOwner);
    if(videos){
        const videoDTOs = [];
        if(videos){
            for(let i=0;i<videos.length;i++){
                videoDTOs.push(new VideoDTO(videos[i]));
            }
        }
        return videoDTOs;
    }
    return undefined;
}

export const editVideo = async (_id, videoUrl, title, description, hashtags) => {
    hashtags = new FormatUtil().addHashtags(hashtags);

    const dbVideo 
        = videoUrl ? await findOneByFilterAndUpdate({_id}, {title, description, hashtags}, false)
        : await findOneByFilterAndUpdate({_id}, {videoUrl, title, description, hashtags}, false);
    if(dbVideo)
        return new VideoDTO(dbVideo);
    return undefined;
}

export const uploadVideo = async (videoUrl, thumbUrl, title, description, _id, hashtags) => {
    const newVideo = new VideoDTO();
    newVideo.videoUrl = videoUrl;
    newVideo.thumbUrl = thumbUrl;
    newVideo.title = title;
    newVideo.description = description;
    newVideo.owner = _id;
    newVideo.hashtags = new FormatUtil().addHashtags(hashtags);

    const uploadedVideo = await saveVideo(newVideo.toVideoDBModel(), false);
    if(uploadedVideo)
        return new VideoDTO(uploadedVideo);
    return undefined;
}

export const deleteVideo = async (_id) => {
    return await findOneByIdAndDelete(_id);
}

export const searchVideos = async (keyword)=> {
    const filter = {title: {$regex: new RegExp(keyword, "i")}};// i: ignore lower/upper case
    const videoDBModels = await findVideosByFilter(filter, true);
    if(videoDBModels && videoDBModels.length >= 1){
        const videoDTOs = [];
        for(let i=0;i<videoDBModels.length;i++){
            videoDTOs.push(new VideoDTO(videoDBModels[i]));
        }
        return videoDTOs;
    }
    return undefined;
}

export const doesVideoExist = async (_id) => {
    const videoDBModel = await findVideoById(_id, false);
    if(videoDBModel){
        return new VideoDTO(videoDBModel);
    }
    return undefined;
}

export const updateView = async (_id, view) => {
    const videoDBModel = await findOneByFilterAndUpdate({_id}, {view}, false);
    if(videoDBModel){
        return new VideoDTO(videoDBModel);
    }
    return undefined;
}

export const addCommentOnVideo = async (_id, commentId) => {
    const videoDBModel = await saveCommentInVideo(_id, commentId, false);
    if(videoDBModel){
        return new VideoDTO(videoDBModel);
    }
    return undefined;
}

export const deleteCommentOnVideo = async (_id, commentId) => {
    const videoDBModel = await deleteCommentInVideo(_id, commentId, false);
    if(videoDBModel){
        return new VideoDTO(videoDBModel);
    }
    return undefined;
}