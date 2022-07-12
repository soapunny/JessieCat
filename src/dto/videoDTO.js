import VideoDBModel from "../dbModels/videoDBModel"

class VideoDTO {
    id = undefined
    title = undefined
    description = ""
    date = undefined
    hashtags = undefined
    meta = undefined

    constructor(videoDBModel){
        if(videoDBModel){
            this.id = videoDBModel._id;
            this.title = videoDBModel.title;
            this.description = videoDBModel.description;
            this.date = videoDBModel.date;
            this.hashtags = videoDBModel.hashtags;
            this.meta = videoDBModel.meta;
        }
    }

    toVideoDBModel = () => {
        const id = this.id;
        const title = this.title;
        const description = this.description;
        const date = this.date;
        const hashtags = this.hashtags;
        const meta = this.meta;

        const videoDBModel = new VideoDBModel({
            id,
            title,
            description,
            date,
            hashtags,
            meta
        });

        return videoDBModel;
    }
}

export default VideoDTO;