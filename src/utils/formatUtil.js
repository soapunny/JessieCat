class FormatUtil{
    constructor(){

    }
    to2DigitTimeFormat = (data) => {
        let result = data;
    if(!(result instanceof String)){
        result = result.toString();
    }
    if(result.length < 2)
        result = result.padStart(2, "0");
    return result;
    }

    toFormattedDate = (date) => {
        let formattedDate = "";
        const now = new Date();
        if(date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate()){
            
            formattedDate = this.to2DigitTimeFormat(date.getHours())+":"
                            + this.to2DigitTimeFormat(date.getMinutes());
        }else{
            formattedDate = this.to2DigitTimeFormat(date.getMonth()+1)+"-"
                            + this.to2DigitTimeFormat(date.getDate())+"-"
                            + date.getFullYear();
        }
        return formattedDate;
    }

    toFullDate = (date) => {
        let formattedDate = "";
        formattedDate = this.to2DigitTimeFormat(date.getHours())+":"
                        + this.to2DigitTimeFormat(date.getMinutes())+" "
                        + this.to2DigitTimeFormat(date.getMonth()+1)+"-"
                        + this.to2DigitTimeFormat(date.getDate())+"-"
                        + date.getFullYear();
        return formattedDate;
    }

    toSimpleDate = (date) => {
        let formattedDate = "";
        formattedDate = this.to2DigitTimeFormat(date.getMonth()+1)+"-"
                        + this.to2DigitTimeFormat(date.getDate())+"-"
                        + date.getFullYear();
        return formattedDate;
    }

    addHashtags = (hashtags) => {
        let parsedHashtags = "";
        if(hashtags.length > 0){
            parsedHashtags = hashtags.split(",").map(word => `#${word}`);
        }
        return parsedHashtags;
    }

    removeHashtags = (hashtags) => {
        let parsedHashtags = "";
        if(hashtags.length > 0){
            parsedHashtags = hashtags.map(data => data.substring(1)).join();
        }
        return parsedHashtags;
    }
}

export default FormatUtil;