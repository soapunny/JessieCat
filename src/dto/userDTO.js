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
        }
    }

    init(email, username, password, name, joinDate, location){
        this.email = email;
        this.username = username;
        this.password = password;
        this.name = name;
        this.joinDate = joinDate;
        this.location = location;
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

        const userDBModel = new UserDBModel({
            email,
            githubId,
            avatarUrl,
            username,
            password,
            name,
            joinDate,
            location
        });

        return userDBModel;
    }
}

export default UserDTO;