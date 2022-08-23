import { SITE_NAME, THUMBNAIL_FIELD_NAME, VIDEO_FIELD_NAME } from "../names/names";
import FormatUtil from "../utils/formatUtil";
//npm install --save multer-s3
import multerS3 from "multer-s3";
//npm i aws-sdk
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    },
    logger: console,
});


const multer = require("multer");

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = SITE_NAME;
    res.locals.login = req.session.login;
    res.locals.userDTO = req.session.userDTO;
    res.locals.formatUtil = new FormatUtil();
    next();
}

export const loginOnlyMiddleware = (req, res, next) => {
    if(req.session.login)
        return next();
    
    req.flash("error", "You have to login first.");
    return res.redirect("/login");
}

export const logoutOnlyMiddleware = (req, res, next) => {
    if(!req.session.login)
        return next();

    req.flash("error", "You are already logged in.");
    return res.redirect("/");
}


const awsStorage = multerS3({
    s3: s3,
    bucket: 'jessiecat',
    // acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
        const email = req.session.userDTO.email
        let extArray = file.mimetype.split('/');
        let ext = extArray[extArray.length - 1];

        cb(null, "resources/email/" + Date.now().toString() + '.' + ext);
    }
});

//npm i multer => file upload middleware
export const acceptImageFiles = multer({ storage: awsStorage, limits: {fileSize: 1048576*3} });

//npm i multer => file upload middleware
export const acceptVideoFiles = multer({ storage: awsStorage, limits: {fileSize: 1048576*10} });

//npm i multer => file upload middleware
export const acceptFiles = multer({ storage: awsStorage,  limits: {fileSize: 1048576*10} });
