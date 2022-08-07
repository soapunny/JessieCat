import CommentDTO from "../../dto/commentDTO";
import { addComment } from "../../models/commentModel";

const watchVideoSection = document.getElementById("watchVideoSection");
const commentForm = document.getElementById("commentForm");

const addTempComment = (commentDTO) => {
    const savedComments = document.querySelector(".savedComments");

    const videoComment = document.createElement("article");
    videoComment.className = "videoComment";
    videoComment.dataset.commentid = commentDTO._id;
    const leftMenu = document.createElement("div");
    leftMenu.className = "leftMenu";
    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = commentDTO.owner.avatarUrl
    const rightMenu = document.createElement("div");
    rightMenu.className = "rightMenu";
    const usernameArea = document.createElement("div");
    usernameArea.className = "usernameArea";
    const username = document.createElement("a");
    username.className = "username";
    username.href = `/user/profile/${commentDTO.owner.username}`;
    username.innerText = commentDTO.owner.username;
    const date = document.createElement("small");
    date.className = "date";
    date.innerText = commentDTO.date;
    const messageArea = document.createElement("div");
    messageArea.className = "messageArea";
    const comment = document.createElement("p");
    comment.className = "comment";
    comment.innerText = commentDTO.message;
    const deleteBtn = document.createElement("a");
    deleteBtn.className = "deleteBtn";
    deleteBtn.id = "deleteBtn";
    deleteBtn.href = `/api/video/${commentDTO.video._id}/comment/${commentDTO._id}/delete`;
    deleteBtn.innerText = "X";
    
    leftMenu.appendChild(avatar);
    
    videoComment.appendChild(leftMenu);
    
    usernameArea.appendChild(username);
    usernameArea.appendChild(date);
    rightMenu.appendChild(usernameArea);
    
    messageArea.appendChild(comment);
    messageArea.appendChild(deleteBtn);
    rightMenu.appendChild(messageArea);
    
    videoComment.appendChild(rightMenu);

    savedComments.prepend(videoComment);
}

const handleSubmit = async (event) => {
    event.preventDefault();
    const commentArea = commentForm.querySelector("#commentArea");
    const videoId = watchVideoSection.dataset.videoid;
    const message = commentArea.value.trim();
    commentArea.value = "";
    if(message === ""){
        commentArea.placeholder = " Type atleast a letter";
        return;
    }
    const URL = `/api/video/${videoId}/comment`
    const fetchOptions = { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
        }),
    };
    const response = await fetch(URL, fetchOptions).then(async (response) => {
        if(response.status === 201){
            console.log("created a fake comment");
            const json = await response.json();
            return addTempComment(json.commentDTO);
        }
    });
}

if(commentForm){
    commentForm.addEventListener("submit", handleSubmit);

    const articles = document.querySelectorAll(".videoComment");
}

//62f0197a2866585573e31817