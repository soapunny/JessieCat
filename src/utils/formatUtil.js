
export const to2DigitTimeFormat = (data) => {
    let result = data;
    if(!(result instanceof String)){
        result = result.toString();
    }
    if(result.length < 2)
        result = result.padStart(2, "0");
    return result;
}

export const toFormattedDate = (date) => {
    let formattedDate = "";
    const now = new Date();
    if(date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()){
        
        formattedDate = to2DigitTimeFormat(date.getHours())+":"
                        + to2DigitTimeFormat(date.getMinutes());
    }else{
        formattedDate = to2DigitTimeFormat(date.getMonth()+1)+"-"
                        + to2DigitTimeFormat(date.getDate())+"-"
                        + date.getFullYear();
    }
    return formattedDate;
}

export const toFullDate = (date) => {
    let formattedDate = "";
    formattedDate = to2DigitTimeFormat(date.getHours())+":"
                    + to2DigitTimeFormat(date.getMinutes())+" | "
                    + to2DigitTimeFormat(date.getMonth()+1)+"-"
                    + to2DigitTimeFormat(date.getDate())+"-"
                    + date.getFullYear();
    return formattedDate;
}

export const addHashtags = (hashtags) => {
    let parsedHashtags = "";
    if(hashtags.length > 0){
        parsedHashtags = hashtags.split(",").map(word => `#${word}`);
    }
    return parsedHashtags;
}

export const removeHashtags = (hashtags) => {
    let parsedHashtags = "";
    if(hashtags.length > 0){
        parsedHashtags = hashtags.map(data => data.substring(1)).join();
    }
    return parsedHashtags;
}