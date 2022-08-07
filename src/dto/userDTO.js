import UserDBModel from "../db/userDBModel";

class UserDTO {
    _id = undefined
    email = undefined
    githubId = undefined
    avatarUrl = undefined
    username = undefined
    password = undefined
    name = undefined
    joinDate = undefined
    location = undefined
    comments = undefined
    likes = undefined
    videos = undefined
    status = undefined
    level = undefined

    constructor(userDBModel){
        if(userDBModel){
            this._id = userDBModel._id;
            this.email = userDBModel.email;
            this.githubId = userDBModel.githubId;
            this.avatarUrl = userDBModel.avatarUrl;
            this.username = userDBModel.username;
            //this.password = userDBModel.password;
            this.name = userDBModel.name;
            this.joinDate = userDBModel.joinDate;
            this.location = userDBModel.location;
            this.comments = userDBModel.comments;
            this.likes = userDBModel.likes;
            this.videos = userDBModel.videos;
            this.status = userDBModel.status;
            this.level = userDBModel.level;
        }
    }

    toUserDBModel = () => {
        const email = this.email;
        const githubId = this.githubId;
        const avatarUrl = this.avatarUrl;
        const username = this.username;
        const password = this.password;
        const name = this.name;
        const joinDate = this.joinDate;
        const location = this.location;
        const comments = this.comments;
        const likes = this.likes;
        const videos = this.videos;
        const status = this.status;
        const level = this.level;

        const userDBModel = new UserDBModel({
            email,
            githubId,
            avatarUrl,
            username,
            password,
            name,
            joinDate,
            location,
            comments,
            likes,
            videos,
            status,
            level
        });

        return userDBModel;
    }
}

export default UserDTO;