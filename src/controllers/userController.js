import { joinUser, login, checkUser, editUser, updateAvatar, checkEmail, checkUsername, getUserByEmail, getGithubEmail, updatePassword, getUserByUsername, joinGithubUser } from "../models/userModel";

export const getJoin = (req, res) => {
    res.render("createAccount", {pageTitle: "Sign Up"});
}

export const postJoin = async (req, res) => {
    try{
        const {email, username, password, repassword, name, location} = req.body;
        const emailExists = await checkEmail(email, false);
        const usernameExists = await checkUsername(username, false);

        if(password !== repassword){
            return res.status(400).render("createAccount", {pageTitle: "Sign Up", errorMessage: "Password is not matching", email, username, password, name, location});
        }
        else if(emailExists){
            return res.status(400).render("createAccount", {pageTitle: "Sign Up", errorMessage: "Duplicate email", email, username, password, name, location});
        }else if(usernameExists){
            return res.status(400).render("createAccount", {pageTitle: "Sign Up", errorMessage: "Duplicate username", email, username, password, name, location});
        }

        await joinUser(email, username, password, name, location, false);

        return res.redirect("/login");
    }catch(error){
        return res.status(400).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}
export const getLogin = (req, res) => {
    try{
        res.render("login", {pageTitle: "Sign in"});
    }catch(error){
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const postLogin = async (req, res) => {
    try{
        const{email, password} = req.body;
        const userDTO = await login(email, password, true);
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
    try{
        const {code} = req.query;
        if(!code){
            return res.redirect("/login");
        }
        const userInfo = await getGithubEmail(code);
        
        if(!userInfo || !userInfo.email)
            return res.redirect("/login");
        
        const userDTO = await getUserByEmail(userInfo.email, false);
        if(userDTO && userDTO.githubId === userInfo.githubId){
            const updatedUserDTO = await updateAvatar(userInfo.email, userInfo.avatarUrl, true);
            req.session.login = true;
            req.session.userDTO = updatedUserDTO;
            return res.redirect("/");
        }else if(userDTO){
            return res.status(400).redirect("/login");
        }else{
            const newUser = joinGithubUser(userInfo, false);
            if(newUser)
                return res.redirect("/login");
            throw new Error("Error: The username doesn't exist.");
        }
    }catch(error){
        return res.status(400).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}
//End Login with github

export const getLogout = (req, res) =>{
    req.session.destroy();
    res.redirect("/");
}

export const getProfile = async (req, res) => {
    try{
        const {username} = req.params;
        const user = await getUserByUsername(username, true);
        if(user){
            return res.render("userProfile", {pageTitle: user.username, user});
        }else
            throw new Error("Error: The username doesn't exist.");
    }catch(error){
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getEdit = (req, res) => {
    try{
        return res.render("userEdit", {pageTitle: "Edit profile"});
    }catch(error){
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const postEdit = async (req, res) => {
    try{
        const { email, avatarUrl } = req.session.userDTO;
        const { username, name, location } = req.body;
        
        const file = req.file;
        const filePath = file ? `/${file.path}` : avatarUrl;

        const originalUsername = req.session.userDTO.username;
        if(originalUsername !== username){
            const doesUsernameExists = await checkUsername(username, false);
            if(doesUsernameExists){
                return res.status(400).render("userEdit", {errorMessage: "Duplicate username"});
            }
        }

        const userDTO = await editUser(email, username, name, location, filePath, true);
        if(userDTO){
            req.session.login = true;
            req.session.userDTO = userDTO;
            return res.redirect("/user/edit");
        }
        throw new Error("Error: User Edit Failed");
    }catch(error){
        return res.render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
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
        const {email, githubId} = req.session.userDTO;
        
        if(newPassword !== newPassword2){
            //TODO send a duplicate password message
            return res.status(400).render("changePassword", {pageTitle: "Change Password", errorMessage: "#Passwords do not match"});
        }
        const exist = await checkUser(email, oldPassword, false);
        if(exist){
            const newUserDTO = await updatePassword(email, newPassword, false);
            if(!newUserDTO || !(newUserDTO.email)){
                throw new Error("Error: Change-password failed");
            }
            //TODO send notification
            return res.redirect("/user/logout");
        }
        //TODO send a wrong password message.
        return res.status(400).render("changePassword", {pageTitle: "Change Password", errorMessage: "#Your original password is not correct"});
    }catch(error){
        return res.render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getDelete = (req, res) => {
    //TDOO make code for "User Delete";
    return res.redirect("/user/logout");
}

