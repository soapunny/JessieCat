import VideoDBModel from "../dbModels/videoDBModel";

export const SelectAllVideos = () => {
    //Call back method
    VideoDBModel.find({}, (error, videos) => {// {}: find everything.
        if(error)
            console.log("VideoDB Error: "+error);
        return videos;
    });
}