const fs = require('fs');

export const getImgDir = (userId) => {
    return `upload/${userId}/img`;
}

export const makeFolder = (dir) => {
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir, {recursive: true});//to make the parent folders together.
    }
}