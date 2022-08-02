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
const ENCODING_BTN = "Encoding Video ";
const FULLSCREEN_CLASS = "toFullScreen";

const recorder = document.getElementById("recorder");
const preview = recorder.querySelector("#preview");
const recordBtn = recorder.querySelector("#recordBtn");
const recordIcon = recordBtn.querySelector("#recordIcon");

let videoStream = null;
let streamTracks = null;
let isRecordOn = false;
let mediaRecorder = null;
let ffmpeg = null;
let videoFile = null;
let videoUrl = null;
let thumbUrl = null;
let isBeingEncoded = false;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg"
}

const encodingProgress = ["[#---------]"
                          , "[##--------]"
                          , "[###-------]"
                          , "[####------]"
                          , "[#####-----]"
                          , "[######----]"
                          , "[#######---]"
                          , "[########--]"
                          , "[#########-]"
                          , "[##########]"];

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
            isBeingEncoded = await handleDownload();
            protectVideoEncoding();
        }else if(!isRecordOn){
            startRecord();
        }else{
            stopRecord();
            //document.exitFullscreen();
        }
    }
}

const protectVideoEncoding = () => {
    if(isBeingEncoded){
        recordBtn.removeEventListener("click", handleRecord);
        changeClassname(recordIcon, "");
        recordIcon.innerText = ENCODING_BTN + encodingProgress[0];
        recordBtn.disabled = true;
    }else{
        recordBtn.addEventListener("click", handleRecord);
        changeClassname(recordIcon, RECORD_ICON_CLASS);
        recordIcon.innerText = RECORD_BTN;
        recordBtn.disabled = false;
    }
}

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
}

const releaseEncodingResources = () => {
    //release resources
    if(ffmpeg){
        ffmpeg.FS("unlink", files.input);
        ffmpeg.FS("unlink", files.output);
        ffmpeg.FS("unlink", files.thumb);
        ffmpeg = null;
    }

    if(videoUrl){
        URL.revokeObjectURL(videoUrl);
        videoUrl = null;
    }
    if(thumbUrl){
        URL.revokeObjectURL(thumbUrl);
        thumbUrl = null;
    }
    if(videoFile){
        URL.revokeObjectURL(videoFile);
        videoFile = null;
    }
}

const handleDownload = async () => {
    
    return new Promise(async (resolve, reject) => {
        isBeingEncoded = true;
        protectVideoEncoding();


        ffmpeg = createFFmpeg({
            log: true
            ,
        });
        await ffmpeg.load();
        ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
        recordIcon.innerText = ENCODING_BTN + encodingProgress[4];
        //encoding webm => 60 frame/s, mp4
        await ffmpeg.run("-i", files.input
                        , "-r", "60", files.output);
        recordIcon.innerText = ENCODING_BTN + encodingProgress[6];
        
        await ffmpeg.run("-i", files.input
                        , "-ss", "00:00:01"
                        , "-frames:v", "1", files.thumb);
        recordIcon.innerText = ENCODING_BTN + encodingProgress[8];
        
        const mp4File = ffmpeg.FS("readFile", files.output);//return Unit8Array data.
        const thumbFile = ffmpeg.FS("readFile", files.thumb);
        
        const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"});//change it into Blob
        const thumbBlob = new Blob([thumbFile.buffer], {type: "image/jpb"});

        videoUrl = URL.createObjectURL(mp4Blob);
        thumbUrl = URL.createObjectURL(thumbBlob);

        downloadFile(videoUrl, "MyRecording.mp4");
        downloadFile(thumbUrl, "MyThumbnail.jpg");
        
        releaseEncodingResources();
        recordIcon.innerText = ENCODING_BTN + encodingProgress[9];

        
        const isFullScreen = document.fullscreenElement;
        if(isFullScreen)
            startCamera();

        resolve(false);
    });

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
    isRecordOn = false;
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
    videoStream = null;
}

const startFullscreen = () => {
    recorder.requestFullscreen();
    recorder.classList.add(FULLSCREEN_CLASS);
    preview.classList.remove(HIDDEN_CLASS);
    startCamera();//Init the recordstream.
}

const endFullscreen = async () => {
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