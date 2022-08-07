import LikeDBModel from "../db/LikDBModel";

class LikeDTO {
    _id = undefined;
    owner = undefined;
    video = undefined;
    date = undefined;

    constructor(likeDBModel){
        if(likeDBModel){
            this._id = likeDBModel._id;
            this.owner = likeDBModel.owner;
            this.video = likeDBModel.video;
            this.date = likeDBModel.date;
        }
    }

    toLikeDBModel = () => {
        const owner = this.owner;
        const video = this.video;
        const date = this.date;

        const likeDBModel = new LikeDBModel({
            owner,
            video,
            date
        });

        return likeDBModel;
    }
}

export default LikeDTO;