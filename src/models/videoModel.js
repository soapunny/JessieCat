import VideoDTO from "../dto/videoDTO";
import { addHashtags } from "../utils/formatUtil";
import {selectAllVideos, selectVideosByTitle, updateVideo, findOneAndUpdate, selectVideoById, findOneAndDelete} from "../dao/videoDAO";

export const getVideos = async () => {
    const videos = await selectAllVideos();
    const videoDTOs = [];
    if(videos){
        for(let i=0;i<videos.length;i++){
            videoDTOs.push(new VideoDTO(videos[i]));
        }
    }
    return videoDTOs;
}
export const getVideo = async (id) => {
    const videoDBModel = await selectVideoById(id);
    const videoDTO = await new VideoDTO(videoDBModel);
    return videoDTO;
}

export const editVideo = (id, title, description, hashtags) => {
    hashtags = addHashtags(hashtags);

    const dbVideo = findOneAndUpdate(id, title, description, hashtags);
    return dbVideo;
}

export const uploadVideo = (title, description, hashtags) => {
    const newVideo = new VideoDTO();
    newVideo.title = title;
    newVideo.description = description;
    newVideo.hashtags = addHashtags(hashtags);

    updateVideo(newVideo.toVideoDBModel());
}

export const deleteVideo = (id) => {
    findOneAndDelete(id);
}

export const searchVideos = async (keyword)=> {
    const videoDBModels = await selectVideosByTitle(keyword);
    const videoDTOs = [];
    if(videoDBModels){
        for(let i=0;i<videoDBModels.length;i++){
            videoDTOs.push(new VideoDTO(videoDBModels[i]));
        }
    }
    return videoDTOs;
}
