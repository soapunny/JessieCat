import VideoDTO from "../dto/videoDTO";
import {SelectAllVideos} from "../dao/videoDAO";

export const getVideos = () => {
    return SelectAllVideos();
}
export const getVideo = (id) => {
    let video = null;
    if(videos){
        for(let i=0;i<videos.length;i++){
            if(videos[i].id === id){
                video = videos[i];
                break;
            }
        }
    }
    return video;
}

export const editVideo = (newVideo) => {
    const video = null;
    if(videos){
        for(let i=0;i<videos.length;i++){
            if(videos[i].id === newVideo.id){
                videos[i].title = newVideo.title;
                // videos[i].length = newVideo.length;
                // videos[i].date = newVideo.date;
                // videos[i].like = newVideo.like;
                // videos[i].views = newVideo.views;
                break;
            }
        }
    }
}

export const uploadVideo = (newVideo) => {
    newVideo.id = `${videoId++}v`;
    newVideo.length = Math.floor(Math.random()*1000);
    newVideo.date = `${String(new Date().getMonth()+1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}-${new Date().getFullYear()}`;
    newVideo.like = 0;
    newVideo.view = 0;

    videos.push(newVideo);
}
