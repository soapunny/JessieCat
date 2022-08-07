//npm i node-fetch@2 -> to use fetch in nodejs
import fetch from "node-fetch";//TODO Fix the import problem
import { saveUser, findUserByFilter, findUserByEmailAndPassword, findUserByFilterAndUpdate, doesIdExist, doesEmailExist, doesUsernameExist, saveVideosInUser, removeVideoInUser, findUserById, deleteUserbyEmail, saveCommentInUser, deleteCommentInUser } from "../dao/userDAO"
import UserDBModel from "../db/userDBModel";
import UserDTO from "../dto/userDTO";


export const joinUser = async (email, username, password, name, location, statusId) => {
    
    const userDTO = new UserDTO();
    userDTO.email = email;
    userDTO.username = username;
    userDTO.password =  password;
    userDTO.name = name;
    userDTO.location = location;
    userDTO.status = statusId;
    
    const userDBModel = await saveUser(userDTO.toUserDBModel(), false);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}

export const joinGithubUser = async (userDTO) => {
    const userDBModel = await saveUser(userDTO.toUserDBModel(), false);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}

export const getUserSession = async (_id) => {
    const userDBModel = await findUserById(_id, true);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}

export const login = async (email, password) => {
    const userDBModel = await findUserByEmailAndPassword(email, password, true);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}

export const editUser = async (email, username, name, location, avatarUrl) => {
    const userDBModel = await findUserByFilterAndUpdate({email}, {username, name, location, avatarUrl}, true);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}

export const getUserByEmail = async(email) => {
    const userDBModel = await findUserByFilter({email}, false);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}

export const getUserProfile = async(username) => {
    const userDBModel = await findUserByFilter({username}, true);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}

export const checkUserId = async (_id) => {
    return await doesIdExist(_id, false);
}

export const checkEmail = async(email) => {
    return await doesEmailExist(email, false);
}

export const checkUsername = async(username) => {
    return await doesUsernameExist(username, false);
}

export const getGithubEmail = async(code) => {
    let userDTO = new UserDTO();

    const config = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRETS,
        code: code
    }
    const params = new URLSearchParams(config);
    const baseUrl = "https://github.com/login/oauth/access_token";
    const finalUrl = `${baseUrl}?${params}`;

    await fetch(finalUrl, {
            method: "POST",
            headers:{
            'Accept': 'application/json'
        }
    }).then(response => response.json())
    .then(async tokenRequest => {
        if("access_token" in tokenRequest){
            const {access_token} = tokenRequest;
            const apiUrl = "https://api.github.com";

            //fetch for user information
            await fetch(`${apiUrl}/user`,{
                headers:{
                    'Authorization': `token ${access_token}`
                }
            }).then(response => response.json())
            .then(json =>{
                userDTO.githubId = json.id;
                userDTO.avatarUrl = json.avatar_url;
                userDTO.username = json.login;
                userDTO.name = json.name;
                userDTO.location = json.location;
                userDTO.password = process.env.SOCIAL_LOGIN_PASSWORD;
            });
            //fetch for email information
            await fetch(`${apiUrl}/user/emails`, {
                    headers:{
                        'Authorization': `token ${access_token}`
                    }
            }).then(response => response.json())
            .then(json => {
                //if this email is primary and verified email
                userDTO.email = json.find(email => email.primary === true && email.verified === true).email;
            });
        }else{
            return undefined;
        }
    });

    return userDTO;
}

export const updateAvatar = async (email, avatarUrl) => {
    return await findUserByFilterAndUpdate({email}, {avatarUrl}, true);
}

export const checkUser = async (email, password) => {
    const userDBModel = await findUserByEmailAndPassword(email, password, false);
    if(userDBModel)
        return true;
    return false; 
}

export const updatePassword = async (email, password, needVideos) => {
    const filter = {email};
    const hashedPassword = await UserDBModel.hashPassword(password);
    const update = {password: hashedPassword}
    const userDBModel = await findUserByFilterAndUpdate(filter, update, needVideos);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}


export const updateVideosInUser = async (userId, videoId) => {
    const updatedUser = await saveVideosInUser(userId, videoId, true);
    if(updatedUser)
        return new UserDTO(updatedUser);
    return undefined;
}

export const deleteVideoInUser = async (userId, videoId) => {
    const updatedUser = await removeVideoInUser(userId, videoId, true);
    if(updatedUser)
        return new UserDTO(updatedUser);
    return undefined;
}

export const deleteUser = async (email) => {
    const updatedUser = await deleteUserbyEmail(email, true);
    if(updatedUser)
        return new UserDTO(updatedUser);
    return undefined;
}

export const addCommentOnUser = async (userId, commentId) => {
    const updatedUser = await saveCommentInUser(userId, commentId, true);
    if(updatedUser)
        return new UserDTO(updatedUser);
    return undefined;
}

export const deleteCommentOnUser = async (userId, commentId) => {
    const updatedUser = await deleteCommentInUser(userId, commentId, true);
    if(updatedUser)
        return new UserDTO(updatedUser);
    return undefined;
}