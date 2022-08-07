import CommentDBModel from "../db/commentDBModel";

class CommentDTO {
    _id = undefined;
    message = undefined;
    owner = undefined;
    video = undefined;
    date = undefined;

    constructor(commentDBModel){
        if(commentDBModel){
            this._id = commentDBModel._id;
            this.message = commentDBModel.message;
            this.owner = commentDBModel.owner;
            this.video = commentDBModel.video;
            this.date = commentDBModel.date;
        }
    }

    toCommentDBModel = () => {
        const message = this.message;
        const owner = this.owner;
        const video = this.video;
        const date = this.date;

        const commentDBModel = new CommentDBModel({
            message,
            owner,
            video,
            date
        });

        return commentDBModel;
    }

    getFormattedDate = () => {
        if(this.date.getDate() === new Date().getDate()
            && this.date.getMonth() === new Date().getMonth()
            && this.date.getFullYear() === new Date().getFullYear()
        ){
            return `${this.date.getHours()}:${this.date.getMinutes()}`;    
        }
        return `${this.date.getMonth()+1}-${this.date.getDate()}-${this.date.getFullYear()}`;    
    }
}

export default CommentDTO;