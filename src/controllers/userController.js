import { logicalExpression } from "@babel/types";
import session from "express-session";
import UserDTO from "../dto/userDTO";
import { joinUser, login, checkUser, editUser, updateAvatar, checkEmail, checkUsername, getUserByEmail, getGithubEmail, updatePassword } from "../models/userModel";

export const getJoin = (req, res) => {
    res.render("createAccount", {pageTitle: "Sign Up"});
}
export const postJoin = async (req, res) => {
    try{
        const {email, username, password, repassword, name, location} = req.body;
        const emailExists = await checkEmail(email);
        const usernameExists = await checkUsername(username);
        const userDTO = new UserDTO();
        userDTO.init(email, username, password, name, undefined, location);

        if(password !== repassword){
            return res.status(400).render("createAccount", {pageTitle: "Sign Up", passwordError: true, email, username, password, name, location});
        }
        else if(emailExists){
            return res.status(400).render("createAccount", {pageTitle: "Sign Up", duplicateEmail: true, email, username, password, name, location});
        }else if(usernameExists){
            return res.status(400).render("createAccount", {pageTitle: "Sign Up", duplicateUsername: true, email, username, password, name, location});
        }

        await joinUser(userDTO);

        res.redirect("/login");
    }catch(error){
        return res.status(400).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}
export const getLogin = (req, res) => {
    try{
        res.render("login", {pageTitle: "Sign In"});
    }catch(error){
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const postLogin = async (req, res) => {
    try{
        const{email, password} = req.body;
        const userDTO = await login(email, password);
        if(userDTO){
            req.session.login = true;
            req.session.userDTO = userDTO;
            res.redirect("/");
        }else{
            res.status(400).render("login", {pageTitle: "Sign In", email, password, errorMessage: "Email or password is not correct."});
        }

    }catch(error){
        return res.render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

//Login with github
export const getGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID,
        allow_signup: false,
        scope: "read:user user:email",
    }
    const params = new URLSearchParams(config);
    const finalUrl = `${baseUrl}?${params.toString()}`;
    res.redirect(finalUrl);
}
export const getGithubCallback = async (req, res) => {
    const userInfo = await getGithubEmail(req.query.code);
    
    if(!userInfo || !userInfo.email)
        return res.redirect("/login");
    
    const userDTO = await getUserByEmail(userInfo.email);
    if(userDTO && userDTO.githubId === userInfo.githubId){
        const updatedUserDTO = await updateAvatar(userInfo.email, userInfo.avatarUrl);
        req.session.login = true;
        req.session.userDTO = updatedUserDTO;
        res.redirect("/");
    }else if(userDTO){
        res.status(400).redirect("/login");
    }else{
        joinUser(userInfo);
        res.redirect("/login");
    }
}
//End Login with github

export const getLogout = (req, res) =>{
    req.session.destroy();
    res.redirect("/");
}

export const getProfile = (req, res) => {
    try{
        res.render("userProfile", {pageTitle: "Profile"});
    }catch(error){
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getEdit = (req, res) => {
    try{
        res.render("userEdit", {pageTitle: "Edit profile"});
    }catch(error){
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const postEdit = async (req, res) => {
    const { email, avatarUrl } = req.session.userDTO;
    const {username, name, location} = req.body;
    const file = req.file;

    const filePath = file ? file.path : avatarUrl;

    const originalUsername = req.session.userDTO.username;
    if(originalUsername !== username){
        const doesUsernameExists = await checkUsername(username);
        if(doesUsernameExists){
            return res.status(400).render("userEdit", {duplicateUsername: true});
        }
    }

    const userDTO = await editUser(email, username, name, location, filePath);
    if(userDTO){
        req.session.login = true;
        req.session.userDTO = userDTO;
        return res.redirect("/user/edit");
    }else{
        return res.render("errors/server-error", {pageTitle: "Error", errorMessage: "Fail: User update"});
    }
}

export const getChangePassword = (req, res) => {
    const {githubId} = req.session.userDTO;
    if(!githubId)
        return res.render("changePassword", {pageTitle: "Change Password"});
    return res.redirect("/");
}

export const postChangePassword = async (req, res) => {
    try{
        const {oldPassword, newPassword, newPassword2} = req.body;
        const {email} = req.session.userDTO;
        if(newPassword !== newPassword2){
            //TODO send a duplicate password message
            return res.status(400).render("changePassword", {pageTitle: "Change Password", errorMsg: "#Passwords do not match"});
        }
        const exist = await checkUser(email, oldPassword);
        if(exist){
            const newUserDTO = await updatePassword(email, newPassword);
            if(!newUserDTO || !(newUserDTO.email)){
                throw new Error("Error: Change-password failed");
            }
            //TODO send notification
            return res.redirect("/user/logout");
        }
        //TODO send a wrong password message.
        return res.status(400).render("changePassword", {pageTitle: "Change Password", errorMsg: "#Your original password is not correct"});
    }catch(error){
        return res.render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getDelete = (req, res) => {
    res.send("User Delete");
}