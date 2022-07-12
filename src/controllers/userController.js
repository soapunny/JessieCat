import { logicalExpression } from "@babel/types";
import UserDTO from "../dto/userDTO";
import { joinUser, login, checkEmail, checkUsername } from "../models/userModel";

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
export const getUser = (req, res) => {
    res.send("User Home");
}
export const getLogout = (req, res) =>{
    req.session.login = false;
    req.session.userDTO = undefined;
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
    res.send("User Edit");
}
export const getDelete = (req, res) => {
    res.send("User Delete");
}