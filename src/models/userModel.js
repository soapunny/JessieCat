//npm i node-fetch@2 -> to use fetch in nodejs
import fetch from "node-fetch";//TODO Fix the import problem
import { saveUser, findUserByFilter, findUserByEmailAndPassword, findUserByFilterAndUpdate, doesEmailExist, doesUsernameExist, saveVideosInUser, removeVideoInUser } from "../dao/userDAO"
import UserDBModel from "../db/userDBModel";
import UserDTO from "../dto/userDTO";


export const joinUser = async (email, username, password, name, location, needVideos) => {
    const userDTO = new UserDTO();
    userDTO.email = email;
    userDTO.username = username;
    userDTO.password =  password;
    userDTO.name = name;
    userDTO.location = location;
    await saveUser(userDTO.toUserDBModel(), needVideos);
}

export const joinGithubUser = async (userDTO, needVideos) => {
    const userDBModel = await saveUser(userDTO.toUserDBModel(), needVideos);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}

export const login = async (email, password, needVideos) => {
    const userDBModel = await findUserByEmailAndPassword(email, password, needVideos);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}

export const editUser = async (email, username, name, location, avatarUrl, needVideos) => {
    const userDBModel = await findUserByFilterAndUpdate({email}, {username, name, location, avatarUrl}, needVideos);
    return new UserDTO(userDBModel);
}

export const getUserByEmail = async(email, needVideos) => {
    const userDBModel = await findUserByFilter({email}, needVideos);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}

export const getUserByUsername = async(username, needVideos) => {
    const userDBModel = await findUserByFilter({username}, needVideos);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}

export const checkEmail = async(email, needVideos) => {
    return await doesEmailExist(email, needVideos);
}

export const checkUsername = async(username, needVideos) => {
    return await doesUsernameExist(username, needVideos);
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

export const updateAvatar = async (email, avatarUrl, needVideos) => {
    return await findUserByFilterAndUpdate({email}, {avatarUrl}, needVideos);
}

export const checkUser = async (email, password, needVideos) => {
    const userDBModel = await findUserByEmailAndPassword(email, password, needVideos);
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


export const updateVideosInUser = async (userId, videoId, needVideos) => {
    const updatedUser = await saveVideosInUser(userId, videoId, needVideos);
    if(updatedUser)
        return new UserDTO(updatedUser);
    return undefined;
}

export const deleteVideoInUser = async (userId, videoId, needVideos) => {
    const updatedUser = await removeVideoInUser(userId, videoId, needVideos);
    if(updatedUser)
        return new UserDTO(updatedUser);
    return undefined;
}