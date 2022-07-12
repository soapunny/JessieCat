import VideoDBModel from "../db/videoDBModel";

//Call back method **Old
// export const SelectAllVideos = () => {
    
//     VideoDBModel.find({}, (error, videos) => {// {}: find everything.
//         if(error)
//             console.log("VideoDB Error: "+error);
//         return videos;
//     });
//}

//Promise: async await method ***New
export const selectAllVideos = async () => {
    const videoDBModels = await VideoDBModel.find({}).sort({date:"desc"});
    return videoDBModels;
}

export const selectVideoById = async (id) => {
    const videoDBModel = await VideoDBModel.findById(id);
    return videoDBModel;
}

export const updateVideo = async (videoDBModel) => {
    const dbVideo = await videoDBModel.save();
    console.log("Updated : "+dbVideo);
}

export const findOneAndUpdate = async (id, title, description, hashtags) => {
    const filter = VideoDBModel.getFilterById(id);
    const update = {title,description,hashtags};
    const dbVideo = await VideoDBModel.findOneAndUpdate(filter, update, {new: true});
    console.log("Updated : "+dbVideo);

    return dbVideo;
}

export const findOneAndDelete = async (id) => {
    //short cut of findOneAndDelete()
    const dbVideo = await VideoDBModel.findByIdAndDelete(id);
}

export const selectVideosByTitle = async (keyword) => {
    const filter = {title:{$regex:new RegExp(keyword, "i")}};// i: ignore lower/upper case
    const videoDBModels = await VideoDBModel.find(filter);
    return videoDBModels;
}