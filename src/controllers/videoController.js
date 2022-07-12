import VideoDTO from "../dto/videoDTO";
import { toFormattedDate, toFullDate, removeHashtags } from "../utils/formatUtil";
import {getVideos, getVideo, editVideo, uploadVideo, deleteVideo, searchVideos} from "../models/videoModel"

export const getHome = async (req, res) => {
    try{
        const videos = await getVideos();
        res.render("home", {pageTitle: "Home", videos, toFormattedDate});
    }catch {
        return res.status(400).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getWatch = async (req, res) => {
    try{
        const videoId = req.params.id;
        const video = await getVideo(videoId);
        if(!video.id){
            throw new Error("Cannot find the video");
        }
        res.render("watchVideo", {pageTitle: video.title, video, toFullDate});
    }catch(error){
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getEdit = async (req, res) => {
    try{
        const videoId = req.params.id;
        const video = await getVideo(videoId);
        if(!video.id)
            throw new Error("Cannot find the video");

        res.render("editVideo", {pageTitle: `Edit \"${video.title}\"`, video, removeHashtags});
    }catch(error){
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const postEdit = async (req, res) => {
    try{
        const videoId = req.params.id;
        const {title, description, hashtags} = req.body;
        const dbVideo = editVideo(videoId, title, description, hashtags);
        if(!dbVideo)
            throw new Error("DB update failed!!");
        
        res.redirect(`/video/${videoId}`);
    }catch(error){
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getUpload = (req, res) => {
    return res.render("uploadVideo", {pageTitle: "Upload Video"});
}

export const postUpload = async (req, res) => {
    //Add video to the video array
    try{
        const {title, description, hashtags } = req.body;//ES6.
        await uploadVideo(title, description, hashtags);
        return res.redirect("/");
    }catch(error){
        console.log(error.message);
        return res.status(400).render(
            "uploadVideo", 
            {pageTitle: "Upload Video", 
            errorMessage: error.message}
        );
    }
    
}

export const getDelete = async (req, res) => {
    //TODO Delete video process
    try{
        const {id} = req.params;
        await deleteVideo(id);
        console.log("Deleted the video : "+id);
        res.redirect("/");
    }catch(error){
        return res.status(400).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getSearch = async(req, res) => {
    try{
        const {keyword} = req.query;
        const videos = await searchVideos(keyword);
        res.render("searchVideos", {pageTitle: `Search \"${keyword}\"`, videos, toFormattedDate});
    }catch(error){
        return res.status(400).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}