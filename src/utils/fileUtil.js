const fs = require('fs');

export const getAvatarDir = (userId) => {
    return `upload/avatar/${userId}`;
}

export const getVideoDir = (userId) => {
    return `upload/video/${userId}`;
}

export const makeFolder = (dir) => {
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, {recursive: true});//to make the parent folders together.
    }
}