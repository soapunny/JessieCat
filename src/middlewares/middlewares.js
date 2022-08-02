import { THUMBNAIL_FIELD_NAME, VIDEO_FIELD_NAME } from "../names/fileNames";
import { getAvatarDir, getVideoDir, makeFolder } from "../utils/fileUtil";
import FormatUtil from "../utils/formatUtil";


const multer = require("multer");

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Jessie Cat";
    res.locals.login = req.session.login;
    res.locals.userDTO = req.session.userDTO;
    res.locals.formatUtil = new FormatUtil();
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

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.session.userDTO._id;
        const dest = getAvatarDir(userId);
        makeFolder(dest);
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const splitedFileName = file.originalname.split(".");
        const extension = splitedFileName[splitedFileName.length-1];
        cb(null, file.fieldname + '-' + Date.now()+'.'+extension);
    },
});

//npm i multer => file upload middleware
export const acceptImageFiles = multer({ storage: imageStorage, limits: {fileSize: 1048576*3} });

const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.session.userDTO._id;
        const dest = getVideoDir(userId);
        makeFolder(dest);
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const splitedFileName = file.originalname.split(".");
        const extension = splitedFileName[splitedFileName.length-1];
        cb(null, file.fieldname + '-' + Date.now()+'.'+extension);
    },
});

//npm i multer => file upload middleware
export const acceptVideoFiles = multer({ storage: videoStorage, limits: {fileSize: 1048576*10} });


const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.fieldname === VIDEO_FIELD_NAME){
            const userId = req.session.userDTO._id;
            const dest = getVideoDir(userId);
            makeFolder(dest);
            cb(null, dest);
        }else if(file.fieldname === THUMBNAIL_FIELD_NAME){
            const userId = req.session.userDTO._id;
            const dest = getVideoDir(userId);
            makeFolder(dest);
            cb(null, dest);
        }
    },
    filename: function (req, file, cb) {
        const splitedFileName = file.originalname.split(".");
        const extension = splitedFileName[splitedFileName.length-1];
        cb(null, file.fieldname + '-' + Date.now()+'.'+extension);
    },
});

//npm i multer => file upload middleware
export const acceptFiles = multer({ storage: fileStorage,  limits: {fileSize: 1048576*10} });
