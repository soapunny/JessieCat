import { getImgDir, makeFolder } from "../utils/fileUtil";

const multer = require("multer");

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Jessie Cat";
    res.locals.login = req.session.login;
    res.locals.userDTO = req.session.userDTO;
    next();
}

export const loginOnlyMiddleware = (req, res, next) => {
    if(req.session.login)
        return next();
    
    return res.redirect("/login");
}

export const logoutOnlyMiddleware = (req, res, next) => {
    if(!req.session.login)
        return next();

    return res.redirect("/");
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.session.userDTO._id;
        const dest = getImgDir(userId);
        makeFolder(dest);
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const splitedFileName = file.originalname.split(".");
        const extension = splitedFileName[splitedFileName.length-1];
        cb(null, file.fieldname + '-' + Date.now()+'.'+extension);
    }
});

//npm i multer => file upload middleware
export const acceptImageFiles = multer({ storage: storage });
