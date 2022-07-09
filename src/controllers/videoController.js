import VideoDTO from "../dto/videoDTO";
import {getVideos, getVideo, editVideo, uploadVideo} from "../models/videoModel"

const testUser = {
    username: "Soapunny",
    loggedIn: true,
}

export const getHome = (req, res) => {
    const videos = getVideos();
    res.render("home", {pageTitle: "Home", testUser, videos});
}
export const getWatch = (req, res) => {
    const videoId = req.params.id;
    const video = getVideo(videoId);

    res.render("watchVideo", {pageTitle: `Watching \"${video.title}\"`, testUser, videoId});
}
export const getEdit = (req, res) => 
{
    const videoId = req.params.id;
    const video = getVideo(videoId);

    res.render("editVideo", {pageTitle: `Edit \"${video.title}\"`, video});
}

export const postEdit = (req, res) => {
    const videoId = req.params.id;
    const newVideo = new VideoDTO();
    newVideo.setId(videoId);
    newVideo.setTitle(req.body.title);
    
    editVideo(newVideo);
    
    res.redirect(`/video/${videoId}`);
}

export const getDelete = (req, res) => res.render("deleteVideo", {pageTitle: "Delete Video"});
export const getUpload = (req, res) => {
    return res.render("uploadVideo", {pageTitle: "Upload Video"});
}
export const postUpload = (req, res) => {
    //Add video to the video array
    const newVideo = new VideoDTO();
    newVideo.title = req.body.title;
    uploadVideo(newVideo);
    
    return res.redirect("/");
}