

const videos = document.querySelectorAll("#video");
const heartBtns = document.querySelectorAll("#heart");
const heartIcons = document.querySelectorAll("#heartIcon");
const EMPTY_HEART_CLASSNAME = "fa-regular fa-heart";
const SOLID_HEART_CLASSNAME = "fa-solid fa-heart";
let currentPlayingVideo = null;

const handleVideoStartPause = (event) => {
    for(let i=0;i<videos.length;i++){
        if(isScrollYInElement(videos[i])){//if the scroll in video
            if(videos[i].paused){
                return videos[i].play();
            }
        }else{
            if(!videos[i].paused){
                return videos[i].pause();
            }
        }
    }
}

const isScrollYInElement = (element) => {
    const scrollY = window.scrollY;
    if(element.offsetTop-element.offsetHeight <= scrollY && scrollY <= element.offsetTop){
        return true;
    }
    return false;
}


const initEvents = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    window.addEventListener("wheel", handleVideoStartPause);
    window.addEventListener("touchstart", handleVideoStartPause);
}

initEvents();
//document.addEventListener("load", initEvents);