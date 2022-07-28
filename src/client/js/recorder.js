//import regeneratorRuntime from "regenerator-runtime";//npm i regenerator-runtime
//npm install @ffmpeg/ffmpeg @ffmpeg/core //webm -> mp4 convertion
const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
import { changeClassname } from "./main";

const STOP_ICON_CLASS = "fa-solid fa-circle-stop";
const RECORD_ICON_CLASS = "fa-solid fa-record-vinyl";
const DOWNLOAD_ICON_CLASS = "fa-solid fa-download";
const HIDDEN_CLASS = "hidden";
const RECORD_BTN = "RECORD";
const STOP_BTN = "STOP";
const DOWNLOAD_BTN = "DOWNLOAD";
const FULLSCREEN_CLASS = "toFullScreen";

const recorder = document.getElementById("recorder");
const preview = recorder.querySelector("#preview");
const recordBtn = recorder.querySelector("#recordBtn");
const recordIcon = recordBtn.querySelector("#recordIcon");

let videoStream = null;
let streamTracks = null;
let isRecordOn = false;
let mediaRecorder = null;
let videoFile = null;

//Init when the windwo starts.
const handleInit = () => {
    preview.classList.add(HIDDEN_CLASS);
}

const handleRecord = async () => {
    const isFullScreen = document.fullscreenElement;
    if(!isFullScreen){//In case it's not fullscreen.
        startFullscreen();
    }else {//In case it's fullscreen
        if(videoFile){//In case you already took a video.
            handleDownload();
        }else if(!isRecordOn){
            startRecord();
        }else{
            stopRecord();
            //document.exitFullscreen();
        }
    }
}

const handleDownload = async () => {
    const ffmpeg = createFFmpeg({
        log: true
        ,
    });
    await ffmpeg.load();
    ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
    //encoding webm => 60 frame/s, mp4
    await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
    await ffmpeg.run("-i"
                    , "recording.webm"
                    , "-ss"
                    , "00:00:01"
                    , "-frames:v"
                    , "1"
                    , "thumbnail.jpg"
                    );

    const mp4File = ffmpeg.FS("readFile", "output.mp4");//Unit8Array data.
    const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");

    const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"});//change it into Blob
    const thumbBlob = new Blob([thumbFile.buffer], {type: "image/jpb"});

    const videoUrl = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = "MyRecording.mp4";
    document.body.appendChild(a);
    a.click();

    const thumbA = document.createElement("a");
    thumbA.href = thumbUrl;
    thumbA.download = "MyThumbnail.jpg";
    document.body.appendChild(thumbA);
    thumbA.click();
}

const startRecord = () => {
    if(!isRecordOn){
        changeClassname(recordIcon, STOP_ICON_CLASS);
        recordIcon.innerText = STOP_BTN;
        recordIcon.classList.add("redFont");
        mediaRecorder = new MediaRecorder(videoStream, {mimeType: "video/webm"});
        mediaRecorder.ondataavailable = (e) => {//Executed after recording.
            const recordData = e.data;
            videoFile = URL.createObjectURL(recordData);
            preview.srcObject = null;
            preview.src = videoFile;
            preview.loop = true;
            preview.play();
        }
        mediaRecorder.start();
        isRecordOn = true;
    }
}

const stopRecord = () => {
    if(isRecordOn){
        recorder.classList.remove(FULLSCREEN_CLASS);
        changeClassname(recordIcon, DOWNLOAD_ICON_CLASS);
        recordIcon.innerText = DOWNLOAD_BTN;
        recordIcon.classList.remove("redFont");
        mediaRecorder.stop();
        isRecordOn = false;
    }
}

const startCamera = async () => {
    const constraints = {audio: true, video: true};
    if(!videoStream){
        await navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            videoStream = stream;
            streamTracks = videoStream.getTracks();
        });

    }
    preview.srcObject = videoStream;
    preview.src = null;
    preview.loop = false;
    preview.play();
    recordIcon.innerText = RECORD_BTN;
}

const endCamera = () => {
    changeClassname(recordIcon, RECORD_ICON_CLASS);
    recordIcon.innerText = RECORD_BTN;
    preview.pause();
    streamTracks.forEach(async (track) => {
        await track.stop();
    });
    mediaRecorder = null;
    preview.srcObject = null;
    preview.src = null;
    preview.loop = false;
    videoFile = null;
    videoStream = null;
}

const startFullscreen = () => {
    recorder.requestFullscreen();
    recorder.classList.add(FULLSCREEN_CLASS);
    preview.classList.remove(HIDDEN_CLASS);
    startCamera();//Init the recordstream.
}

const endFullscreen = () => {
    recorder.classList.remove(FULLSCREEN_CLASS);
    preview.classList.add(HIDDEN_CLASS);
    stopRecord();
    endCamera();
}

const handleExit = () => {
    endFullscreen();
}

window.addEventListener("load", handleInit);
window.addEventListener("unload", handleExit);
recordBtn.addEventListener("click", handleRecord);
document.addEventListener("fullscreenchange", (evt) => {
    const isFullScreen = document.fullscreenElement;
    if(!isFullScreen){
        endFullscreen();
    }
});