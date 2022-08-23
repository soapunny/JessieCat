import { addComment, deleteComment, getComment, getComments } from "../models/commentModel";
import { checkUserId, addCommentOnUser, updateVideosInUser, deleteVideoInUser, deleteCommentOnUser } from "../models/userModel";
import { getHomeVideos, getVideoToWatch, getVideo, editVideo, uploadVideo, deleteVideo, searchVideos, doesVideoExist, updateView, addCommentOnVideo, deleteCommentOnVideo} from "../models/videoModel"
import { saveUserSession } from "./userController";

export const getHome = async (req, res) => {
    try{
        const videos = await getHomeVideos();
        return res.render("home", {pageTitle: "Home", videos});
    }catch {
        req.flash("error", "Fail to load the page.");
        return res.status(400).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getWatch = async (req, res) => {
    try{
        const videoId = req.params.id;
        const video = await getVideoToWatch(videoId);

        if(!video || !(video._id) ){
            throw new Error("Cannot find the video");
        }
        const comments = await getComments(video.comments);

        if(!comments){
            throw new Error("Cannot load the comments");
        }

        video.comments = comments;

        res.render("watchVideo", {pageTitle: video.title, video});
    }catch(error){
        req.flash("error", error.message);
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getEdit = async (req, res) => {
    try{
        const videoId = req.params.id;
        const userId = req.session.userDTO._id;

        const video = await getVideo(videoId);
        if(!video || !(video._id))
            throw new Error("Cannot find the video");
        if(String(video.owner) !== userId){
            return res.status(403).redirect("/");
        }
        return res.render("editVideo", {pageTitle: `Edit \"${video.title}\"`, video});
    }catch(error){
        req.flash("error", "Not authorized.");
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const postEdit = async (req, res) => {
    try{
        const {file} = req;
        const videoId = req.params.id;
        const userId = req.session.userDTO._id;
        const {title, description, hashtags} = req.body;
        const videoUrl = file ? `${file.location}` : undefined;

        const video = await doesVideoExist(videoId);
        if(!video){
            throw new Error("Error: no such video");
        }
        if(String(video.owner) !== userId){
            return res.status(403).redirect("/");
        }
        const dbVideo = await editVideo(videoId, videoUrl, title, description, hashtags);
        if(!dbVideo)
            throw new Error("Error: DB update failed!!");
        
        return res.redirect(`/video/${videoId}`);
    }catch(error){
        req.flash("error", "Cannot edit the video.");
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
        const {video, thumbnail} = req.files;
        const videoUrl = video ? `${video[0].location}` : undefined;
        const thumbUrl = thumbnail ? `${thumbnail[0].location}` : undefined;
        if(!videoUrl || !title){
            return res.render("uploadVideo", {pageTitle: "Upload Video", errorMessage: "Attach at least one video"});
        }
        if(!thumbUrl || !title){
            return res.render("uploadVideo", {pageTitle: "Upload Video", errorMessage: "Attach at least one thumbnail"});
        }
        const newVideo = await uploadVideo(videoUrl, thumbUrl, title, description, userDTO._id, hashtags);

        if(newVideo){
            const user = await updateVideosInUser(userDTO._id, newVideo._id);
            if(user){
                req.session.userDTO = user;//userDTO session update
                return res.redirect("/");
            }
        }
        throw new Error('Error: Video Upload Fail');
    }catch(error){
        console.log(error.message);
        req.flash("error", "Cannot upload the video.");
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
        
        const video = await doesVideoExist(videoId);
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

        const dbUser = await deleteVideoInUser(userDTO._id, videoId);
        if(!dbUser){
            throw new Error("Error: delete video in user error");
        }

        req.session.userDTO = dbUser;//userDTO session update.
        console.log("Deleted the video : "+videoId);
        return res.redirect("/");
    }catch(error){
        req.flash("error", "Cannot delete the video.");
        return res.status(400).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getSearch = async(req, res) => {
    try{
        const {keyword} = req.query;
        const videos = await searchVideos(keyword);
        return res.render("searchVideos", {pageTitle: `Search \"${keyword}\"`, videos});
    }catch(error){
        req.flash("error", "Cannot search the keyword.");
        return res.status(400).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const increaseView = async (req, res) => {
    try{
        const videoId = req.params.id;

        const exists = await doesVideoExist(videoId);
        if(!exists)
            throw new Error("Error: wrong videoId");
        
        const view = exists.view + 1;
        console.log("view : "+view);
        const video = await updateView(videoId, view);
        if(!video){
            throw new Error("Error: view update failed");
        }
        const responseView = JSON.stringify({view: video.view});
        return res.status(200).send(responseView);//sendStatus => To exit the response
    }catch(error){
        req.flash("error", "Cannot increase the view.");
        return res.sendStatus(404);
    }
}

export const postComment = async (req, res) => {
    try{
        const videoId = req.params.id;
        const message = req.body.message;
        const userId = req.session.userDTO._id;

        const commentDTO = await addComment(message, userId, videoId);
        if(commentDTO){
            const userExists = await checkUserId(userId);
            if(userExists){
                const updatedUser = await addCommentOnUser(userId, commentDTO._id);
                await saveUserSession(req, updatedUser);
            }
            const videoExists = await doesVideoExist(videoId);
            if(videoExists){
                await addCommentOnVideo(videoId, commentDTO._id);
            }
            const commentDTOwithMoreData = await getComment(commentDTO._id);
            commentDTOwithMoreData.date = commentDTOwithMoreData.getFormattedDate();
            return res.status(201).send({commentDTO: commentDTOwithMoreData});
        }
        return res.sendStatus("403");
        
    }catch(error){
        console.log(error);
        req.flash("error", "Cannot leave a comment.");
        return res.sendStatus(404);
    }
}

export const GetDeleteComment = async (req, res) => {
    try{
        const videoId = req.params.id;
        const commentId = req.params.commentId;
        const userId = req.session.userDTO._id;

        const commentDTO = await deleteComment(commentId);
        if(commentDTO){
            const userExists = await checkUserId(userId);
            if(userExists){
                console.log("updateUser 전");
                const updatedUser = await deleteCommentOnUser(userId, commentId);
                console.log("updateUser "+updatedUser.comments);
                await saveUserSession(req, updatedUser);
            }
            const videoExists = await doesVideoExist(videoId);
            if(videoExists){
                console.log("updateVideo 전");
                const updatedVideo = deleteCommentOnVideo(videoId, commentId);
                console.log("updateVideo "+updatedVideo.comments);
            }
            return res.status(201).redirect(`/video/${videoId}`);
        }
        return res.status("403").redirect(`/video/${videoId}`);
        
    }catch(error){
        console.log(error.message);
        req.flash("error", "Cannot leave a comment.");
        return res.status(400).render("errors/server-error", {pageTitle: "Error"});
    }
}