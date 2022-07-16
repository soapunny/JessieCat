import { isExistsTypeAnnotation } from "@babel/types";
//npm i node-fetch@2 -> to use fetch in nodejs
import fetch from "node-fetch";//TODO Fix the import problem
import { updateUser, findUserByEmailAndUpdate, findUserByEmailAndUpdatePassword, findUserByEmail, findUserByEmailAndPassword, doesEmailExist, doesUsernameExist, doesUserExist } from "../dao/userDAO"
import UserDTO from "../dto/userDTO";


export const joinUser = async (userDTO) => {
    await updateUser(userDTO.toUserDBModel());
}

export const editUser = async (email, username, name, location, avatarUrl) => {
    const userDBModel = await findUserByEmailAndUpdate(email, {username, name, location, avatarUrl});
    return new UserDTO(userDBModel);
}

export const login = async (email, password) => {
    const userDBModel = await findUserByEmailAndPassword(email, password);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}

export const getUserByEmail = async(email) => {
    const userDBModel = await findUserByEmail(email);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}

export const checkEmail = async(email) => {
    return await doesEmailExist(email);
}

export const checkUsername = async(username) => {
    return await doesUsernameExist(username);
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
    return await findUserByEmailAndUpdate(email, {avatarUrl});
}

export const checkUser = async (email, password) => {
    const userDBModel = await findUserByEmailAndPassword(email, password);
    if(userDBModel)
        return true;
    return false; 
}

export const updatePassword = async (email, password) => {
    const userDBModel = await findUserByEmailAndUpdatePassword(email, password);
    if(userDBModel)
        return new UserDTO(userDBModel);
    return undefined;
}