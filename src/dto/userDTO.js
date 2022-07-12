import UserDBModel from "../dbModels/userDBModel";

class UserDTO {
    email = undefined
    username = undefined
    password = undefined
    name = undefined
    joinDate = undefined
    location = undefined

    constructor(userDBModel){
        if(userDBModel){
            this.email = userDBModel.email;
            this.username = userDBModel.username;
            this.password = userDBModel.password;
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
        const username = this.username;
        const password = this.password;
        const name = this.name;
        const joinDate = this.joinDate;
        const location = this.location;

        const userDBModel = new UserDBModel({
            email,
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