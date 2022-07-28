import FormatUtil from "/src/utils/formatUtil.js";
import {changeClassname} from "./main.js";

console.log("Video Player");

const HIDDEN_CLASS = "hidden";
const PLAY_CLASS = "fa-solid fa-play";
const PAUSE_CLASS = "fa-solid fa-pause";
const MUTE_CLASS = "fa-solid fa-volume-xmark";
const VOLUME_CLASS = "fa-solid fa-volume-high";
const MAXIMIZE_CLASS = "fa-solid fa-up-right-and-down-left-from-center";
const MINIMIZE_CLASS = "fa-solid fa-down-left-and-up-right-to-center";
const WIDTH_FIT_VIDEO_CLASS = "width-fit-video";
const HEIGHT_FIT_VIDEO_CLASS = "height-fit-video";

const watchVideoSection = document.querySelector("#watchVideoSection");
const videoFrame = watchVideoSection.querySelector(".videoFrame");
const controlPanel = watchVideoSection.querySelector(".controlPanel");
const video = watchVideoSection.querySelector(".video");
const playBtn = watchVideoSection.querySelector("#play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = watchVideoSection.querySelector("#mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = watchVideoSection.querySelector("#volume");
const currentTime = watchVideoSection.querySelector("#currentTime");
const totalTime = watchVideoSection.querySelector("#totalTime");
const timeline = watchVideoSection.querySelector("#timeline");
const fullScreen = watchVideoSection.querySelector("#fullScreen");
const fullScreenIcon = fullScreen.querySelector("i");
const formatUtil = new FormatUtil();

let originalVolumeValue = 0.5;
let timeoutObj = null;

const handleKeyup = (e) => {
    switch(e.keyCode){
        case 32:
            e.preventDefault();
            handlePlayPause();//space
            break;
    }
}

const updateView = async () => {
    const videoId = watchVideoSection.dataset.videoid;
    const URL = `/api/video/${videoId}/view`;
    const fetchOption = {method:"POST"};
    await fetch(URL, fetchOption);
    window.location.reload();
}

const handleVideoEnd = (e) => {
    updateView();
}

const handlePlayPause = (e) => {
    if(video.paused){
        changeClassname(playBtnIcon, PAUSE_CLASS);
        video.play();
    }else{
        changeClassname(playBtnIcon, PLAY_CLASS);
        video.pause();
    }
    handleShowControlPanel();
}

const handleMute = (e) => {
    toggleVolumeValue(video.muted);
}

const toggleVolumeValue = (muted) => {
    if(muted){
        changeClassname(muteBtnIcon, VOLUME_CLASS);
        volumeRange.value = originalVolumeValue;
        video.muted = false;
    }else{
        changeClassname(muteBtnIcon, MUTE_CLASS);
        originalVolumeValue = volumeRange.value;
        volumeRange.value = 0;
        video.muted = true;
    }
}

const handleVolumeChange = (event) => {
    const volumeBar = event.target;
    video.volume = volumeBar.value;
    if(video.muted){
        toggleVolumeValue(true);
    }else if(video.volume === 0){
        toggleVolumeValue(false);
    }
}


const handleLoadedMetadata = async () => {
    video.pause();
    video.volumn = 0.5;
    hideControlPanel();
    timeline.max = Math.floor(await video.duration);
    totalTime.innerText = formatUtil.toMinAndSeconds(await video.duration);
}

const handleTimeUpdate = () => {
    currentTime.innerText = formatUtil.toMinAndSeconds(video.currentTime);
    timeline.value = Math.floor(video.currentTime);
}

const handleTimelineChange = () => {
    video.currentTime = timeline.value;
}

const handleFullScreen = () => {
    const isFullScreen = document.fullscreenElement;

    if(!isFullScreen){
        video.classList.add("fullScreenVideo");//VideoSize Change
        changeClassname(fullScreenIcon, MINIMIZE_CLASS);
        return videoFrame.requestFullscreen();
    }
    video.classList.remove("fullScreenVideo");
    changeClassname(fullScreenIcon, MAXIMIZE_CLASS);
    return document.exitFullscreen();
}

const hideControlPanel = () => {
    if(!video.paused){
        timeoutObj = setTimeout(() => {
            controlPanel.classList.add(HIDDEN_CLASS);
        }, 3000);
    }
}

const handleShowControlPanel = (event) => {
    if(timeoutObj){// if "hidden" timeout exists
        clearTimeout(timeoutObj);//cancel timeout
        timeoutObj = null;
    }
    if(controlPanel.classList.contains(HIDDEN_CLASS)){
        controlPanel.classList.remove(HIDDEN_CLASS);
    }
    hideControlPanel();
}


const handleRemoveControlPanel = () => {
    hideControlPanel();
}

window.addEventListener("load", handleLoadedMetadata);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("ended", handleVideoEnd);
document.addEventListener("keydown", handleKeyup, false);
playBtn.addEventListener("click", handlePlayPause);
video.addEventListener("click", handlePlayPause);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreen.addEventListener("click", handleFullScreen);
videoFrame.addEventListener("mousemove", handleShowControlPanel);
videoFrame.addEventListener("mouseleave", handleRemoveControlPanel);
