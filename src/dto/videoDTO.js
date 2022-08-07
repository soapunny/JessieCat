import VideoDBModel from "../db/videoDBModel"

class VideoDTO {
    _id = undefined
    videoUrl = undefined
    thumbUrl = undefined
    title = undefined
    description = ""
    owner = undefined
    date = undefined
    hashtags = undefined
    comments = undefined
    likes = undefined
    view = undefined

    constructor(videoDBModel){
        if(videoDBModel){
            this._id = videoDBModel._id;
            this.videoUrl = videoDBModel.videoUrl;
            this.thumbUrl = videoDBModel.thumbUrl;
            this.title = videoDBModel.title;
            this.description = videoDBModel.description;
            this.owner = videoDBModel.owner;
            this.date = videoDBModel.date;
            this.hashtags = videoDBModel.hashtags;
            this.comments = videoDBModel.comments;
            this.likes = videoDBModel.likes;
            this.view = videoDBModel.view;
        }
    }

    toVideoDBModel = () => {
        const _id = this._id;
        const videoUrl = this.videoUrl;
        const thumbUrl = this.thumbUrl;
        const title = this.title;
        const description = this.description;
        const owner = this.owner;
        const date = this.date;
        const hashtags = this.hashtags;
        const comments = this.comments;
        const likes = this.likes;
        const view = this.view;

        const videoDBModel = new VideoDBModel({
            _id,
            videoUrl,
            thumbUrl,
            title,
            description,
            owner,
            date,
            hashtags,
            comments,
            likes,
            view
        });

        return videoDBModel;
    }
}

export default VideoDTO;