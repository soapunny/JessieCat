class VideoDTO {
    id = "";
    title = "";
    length = 0;
    date = "";
    like = 0;
    view = 0;

    constructor(id, title, length, date, like, view){
        this.id = id;
        this.title = title;
        this.length = length;
        this.date = date;
        this.like = like;
        this.view = view;
    }
    setId = (id) => this.id = id;
    setTitle = (title) => this.title = title;
    setLength = (length) => this.length = length;
    setDate = (date) => this.date = date;
    setLike = (like) => this.like = like;
    setView = (view) => this.view = view;

    getId = () => {return this.id;}
    getTitle = () => {return this.title;}
    getLength = () => {return this.length;}
    getdate = () => {return this.date;}
    getLike = () => {return this.like;}
    getView = () => {return this.view;}
}

export default VideoDTO;