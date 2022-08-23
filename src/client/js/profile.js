const videoFrames = document.querySelectorAll(".videoFrame");

const clickVideoHandler = (event) => {
    console.log(event);
    const target = event.target;
    const videoId = target.dataset.videoid;
    location.href=`/video/${videoId}`;
}

for(let i=0;i<videoFrames.length;i++)
    videoFrames[i].addEventListener("click", clickVideoHandler);