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
    meta = undefined

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
            this.meta = videoDBModel.meta;
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
        const meta = this.meta;

        const videoDBModel = new VideoDBModel({
            _id,
            videoUrl,
            thumbUrl,
            title,
            description,
            owner,
            date,
            hashtags,
            meta
        });

        return videoDBModel;
    }
}

export default VideoDTO;