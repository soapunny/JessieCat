import { updateVideosInUser, deleteVideoInUser } from "../models/userModel";
import { getVideos, getVideo, editVideo, uploadVideo, deleteVideo, searchVideos, doesVideoExist, updateView} from "../models/videoModel"

export const getHome = async (req, res) => {
    try{
        const videos = await getVideos(true);
        return res.render("home", {pageTitle: "Home", videos});
    }catch {
        return res.status(400).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getWatch = async (req, res) => {
    try{
        const videoId = req.params.id;
        const video = await getVideo(videoId, true);

        if(!video || !(video._id) ){
            throw new Error("Cannot find the video");
        }
        res.render("watchVideo", {pageTitle: video.title, video});
    }catch(error){
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getEdit = async (req, res) => {
    try{
        const videoId = req.params.id;
        const userId = req.session.userDTO._id;

        const video = await getVideo(videoId, false);
        if(!video || !(video._id))
            throw new Error("Cannot find the video");
        if(String(video.owner) !== userId){
            return res.status(403).redirect("/");
        }
        return res.render("editVideo", {pageTitle: `Edit \"${video.title}\"`, video});
    }catch(error){
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const postEdit = async (req, res) => {
    try{
        const {file} = req;
        const videoId = req.params.id;
        const userId = req.session.userDTO._id;
        const {title, description, hashtags} = req.body;
        const videoUrl = file ? `/${file.path}` : undefined;

        const video = await doesVideoExist(videoId, false);
        if(!video){
            throw new Error("Error: no such video");
        }
        if(String(video.owner) !== userId){
            return res.status(403).redirect("/");
        }
        const dbVideo = await editVideo(videoId, videoUrl, title, description, hashtags, false);
        if(!dbVideo)
            throw new Error("Error: DB update failed!!");
        
        return res.redirect(`/video/${videoId}`);
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
        const {userDTO} = req.session;
        const {title, description, hashtags } = req.body;//ES6.
        const {file} = req;
        const videoUrl = file ? `/${file.path}` : undefined;
        if(!videoUrl || !title){
            return res.render("uploadVideo", {pageTitle: "Upload Video", errorMessage: "Attach at least one video"});
        }
        const newVideo = await uploadVideo(videoUrl, title, description, userDTO._id, hashtags, false);

        if(newVideo){
            const user = await updateVideosInUser(userDTO._id, newVideo._id, true);
            if(user){
                req.session.userDTO = user;//userDTO session update
                return res.redirect("/");
            }
        }
        throw new Error('Error: Video Upload Fail');
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
        const videoId = req.params.id;
        const {userDTO} = req.session;
        
        const video = await doesVideoExist(videoId, false);
        if(!video){
            throw new Error("Error: no such video");
        }
        if(String(video.owner) !== userDTO._id){
            return res.status(403).redirect("/");
        }

        const dbVideo = await deleteVideo(videoId);
        if(!dbVideo){
            throw new Error("Error: delete video error");
        }

        const dbUser = await deleteVideoInUser(userDTO._id, videoId, true);
        if(!dbUser){
            throw new Error("Error: delete video in user error");
        }

        req.session.userDTO = dbUser;//userDTO session update.
        console.log("Deleted the video : "+videoId);
        return res.redirect("/");
    }catch(error){
        return res.status(400).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getSearch = async(req, res) => {
    try{
        const {keyword} = req.query;
        const videos = await searchVideos(keyword, true);
        return res.render("searchVideos", {pageTitle: `Search \"${keyword}\"`, videos});
    }catch(error){
        return res.status(400).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const increaseView = async (req, res) => {
    try{
        const videoId = req.params.id;

        const exists = await doesVideoExist(videoId, false);
        if(!exists)
            throw new Error("Error: wrong videoId");
        
        const view = exists.meta.view + 1;
        console.log("view : "+view);
        const video = await updateView(videoId, view, false);
        if(!video){
            throw new Error("Error: view update failed");
        }
        return res.sendStatus(200);//sendStatus => To exit the response
    }catch(error){
        console.log(error.message);
        return res.sendStatus(404);
    }
}