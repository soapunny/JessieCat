import VideoDTO from "../dto/videoDTO";
import FormatUtil from "../utils/formatUtil";
import {findAllVideos, findVideosByFilter, findVideoById, saveVideo, findOneByFilterAndUpdate, findOneByIdAndDelete} from "../dao/videoDAO";

export const getVideos = async (needOwner) => {
    const videos = await findAllVideos(needOwner);
    if(videos){
        const videoDTOs = [];
        for(let i=0;i<videos.length;i++){
            videoDTOs.push(new VideoDTO(videos[i]));
        }
        return videoDTOs;
    }
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

export const getVideo = async (_id, needOwner) => {
    const videoDBModel = await findVideoById(_id, needOwner);
    if(videoDBModel)
        return new VideoDTO(videoDBModel);
    return undefined;
}

export const editVideo = async (_id, videoUrl, title, description, hashtags, needOwner) => {
    hashtags = new FormatUtil().addHashtags(hashtags);

    const dbVideo 
        = videoUrl ? await findOneByFilterAndUpdate({_id}, {title, description, hashtags}, needOwner)
        : await findOneByFilterAndUpdate({_id}, {videoUrl, title, description, hashtags}, needOwner);
    if(dbVideo)
        return new VideoDTO(dbVideo);
    return undefined;
}

export const uploadVideo = async (videoUrl, thumbUrl, title, description, _id, hashtags, needOwner) => {
    const newVideo = new VideoDTO();
    newVideo.videoUrl = videoUrl;
    newVideo.thumbUrl = thumbUrl;
    newVideo.title = title;
    newVideo.description = description;
    newVideo.owner = _id;
    newVideo.hashtags = new FormatUtil().addHashtags(hashtags);

    const uploadedVideo = await saveVideo(newVideo.toVideoDBModel(), needOwner);
    if(uploadedVideo)
        return new VideoDTO(uploadedVideo);
    return undefined;
}

export const deleteVideo = async (_id) => {
    return await findOneByIdAndDelete(_id);
}

export const searchVideos = async (keyword, needOwner)=> {
    const filter = {title: {$regex: new RegExp(keyword, "i")}};// i: ignore lower/upper case
    const videoDBModels = await findVideosByFilter(filter, needOwner);
    if(videoDBModels && videoDBModels.length >= 1){
        const videoDTOs = [];
        for(let i=0;i<videoDBModels.length;i++){
            videoDTOs.push(new VideoDTO(videoDBModels[i]));
        }
        return videoDTOs;
    }
    return undefined;
}

export const doesVideoExist = async (_id, needOwner) => {
    const videoDBModel = await findVideoById(_id, needOwner);
    if(videoDBModel){
        return new VideoDTO(videoDBModel);
    }
    return undefined;
}

export const updateView = async (_id, value, needOwner) => {
    const videoDBModel = await findOneByFilterAndUpdate({_id}, {'meta.view': value}, needOwner);
    if(videoDBModel){
        return new VideoDTO(videoDBModel);
    }
    return undefined;
}