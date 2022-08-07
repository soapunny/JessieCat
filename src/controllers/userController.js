import { deleteStatusById, saveNewStatus } from "../models/statusModel";
import { joinUser, login, checkUser, editUser, updateAvatar, checkEmail, checkUsername, getUserByEmail, getGithubEmail, updatePassword, getUserProfile, joinGithubUser, deleteVideoInUser, deleteUserbyEmail, deleteUser } from "../models/userModel";
import DeleteFailureError from "../utils/errors/deleteFailureError";

export const getJoin = (req, res) => {
    return res.render("createAccount", {pageTitle: "Sign Up"});
}

export const postJoin = async (req, res) => {
    try{
        const {email, username, password, repassword, name, location} = req.body;
        const emailExists = await checkEmail(email);
        const usernameExists = await checkUsername(username);

        if(password !== repassword){
            req.flash("error", "The passwords are not matching.");
            return res.status(400).render("createAccount", {pageTitle: "Sign Up", errorMessage: "Password is not matching", email, username, password, name, location});
        }
        else if(emailExists){
            req.flash("error", "Email already exists.");
            return res.status(400).render("createAccount", {pageTitle: "Sign Up", errorMessage: "Duplicate email", email, username, password, name, location});
        }else if(usernameExists){
            req.flash("error", "Username already exists.");
            return res.status(400).render("createAccount", {pageTitle: "Sign Up", errorMessage: "Duplicate username", email, username, password, name, location});
        }

        const statusDTO = await saveNewStatus();
        if(statusDTO){
            const userDTO = await joinUser(email, username, password, name, location, statusDTO._id);
            if(userDTO){
                return res.redirect("/login");
            }
            const deletedStatus = await deleteStatusById(statusDTO._id);
            if(!deletedStatus)
                throw new DeleteFailureError("Failed to delete the status");
        }

        throw new Error("Failed to sign up");
    }catch(error){
        if(error instanceof DeleteFailureError){
            await deleteStatusById(statusDTO._id);
        }
        req.flash("error", "Fail to signup.");
        return res.status(400).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getLogin = (req, res) => {
    try{
        res.render("login", {pageTitle: "Sign in"});
    }catch(error){
        req.flash("error", "Fail to load the login page.");
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const postLogin = async (req, res) => {
    try{
        const{email, password} = req.body;
        const userDTO = await login(email, password);
        if(userDTO){
            saveUserSession(req, userDTO);
            return res.redirect("/");
        }else{
            req.flash("error", "Not authorized.");
            return res.status(400).render("login", {pageTitle: "Sign In", email, password, errorMessage: "Email or password is not correct."});
        }

    }catch(error){
        req.flash("error", "Not authorized.");
        return res.render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}
//To saveData.
export const saveUserSession = async (req, userDTO) => {
    req.session.login = true;
    req.session.userDTO = userDTO;
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
    return res.redirect(finalUrl);
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
        
        const userDTO = await getUserByEmail(userInfo.email);
        if(userDTO && userDTO.githubId === userInfo.githubId){
            const updatedUserDTO = await updateAvatar(userInfo.email, userInfo.avatarUrl);
            saveUserSession(req, updatedUserDTO);
            return res.redirect("/");
        }else if(userDTO){
            return res.status(400).redirect("/login");
        }else{
            const statusDTO = await saveNewStatus();
            if(statusDTO){
                userInfo.status = statusDTO._id;
                const newUser = joinGithubUser(userInfo);
                if(newUser){
                    return res.redirect("/login");
                }
                const deletedStatus = await deleteStatusById(statusDTO._id);
                if(!deletedStatus)
                    throw new DeleteFailureError("Failed to delete the status");
            }
            if(newUser)
                return res.redirect("/login");
            throw new Error("Error: The username doesn't exist.");
        }
    }catch(error){
        if(error instanceof DeleteFailureError){
            await deleteStatusById(statusDTO._id);
        }
        req.flash("error", "Fail to get the user info from Github.");
        return res.status(400).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}
//End Login with github

export const getLogout = (req, res) =>{
    req.session.destroy();
    return res.redirect("/");
}

export const getProfile = async (req, res) => {
    try{
        const {username} = req.params;
        const user = await getUserProfile(username);
        if(user){
            return res.render("userProfile", {pageTitle: user.username, user});
        }else
            throw new Error("Error: The username doesn't exist.");
    }catch(error){
        req.flash("error", "Fail to get the user profile.");
        return res.status(404).render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getEdit = (req, res) => {
    try{
        return res.render("userEdit", {pageTitle: "Edit profile"});
    }catch(error){
        req.flash("error", "Not authorized.");
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
            const doesUsernameExists = await checkUsername(username);
            if(doesUsernameExists){
                req.flash("error", "Username already exists.");
                return res.status(400).render("userEdit", {errorMessage: "Duplicate username"});
            }
        }

        const userDTO = await editUser(email, username, name, location, filePath);
        if(userDTO){
            saveUserSession(req, userDTO);
            return redirect("/user/edit");
        }
        throw new Error("Error: User Edit Failed");
    }catch(error){
        req.flash("error", "Failed to edit user.");
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
            req.flash("error", "Passwords are not matching.");
            return res.status(400).render("changePassword", {pageTitle: "Change Password", errorMessage: "#Passwords do not match"});
        }
        const exist = await checkUser(email, oldPassword);
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
        req.flash("error", "Failed to change your password.");
        return res.render("errors/server-error", {pageTitle: "Error", errorMessage: error.message});
    }
}

export const getDelete = (req, res) => {
    return res.render("deleteUser", {pageTitle: "Delete Account"});
}

export const postDelete = (req, res) => {
    const {password} = req.body;
    const {email} = req.session.userDTO;
    
    if(password){
        const exists = checkUser(email, password);
        if(exists){
            //delete videos
            //delete comments
            //delete likes
            //delete User
            deleteUser(email);
        }
    }

    return res.redirect("/user/logout");
}

