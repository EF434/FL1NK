
"use strict";
///////////////////////////////////////////////////////////////
//     Handle login register, upload profile picture, and 
//          store user's data in local storage
///////////////////////////////////////////////////////////////

// import the validations from the file
import { processInput, login } from "./validations.js";

// make login and signup functions acessible globally
window.processInput = processInput;
window.login = login;

// saving the images user uploaded
let uploaded_image = "";
const image_input = document.querySelector("#profile-image");
const form_checkbox = document.getElementById("checkbox");
const profile_pic = document.getElementById("profile-pic");
const plus_icon = document.getElementById("plus-icon");

// switch between login and signup forms
document.getElementById("show-signup").onclick = function () {
    form_checkbox.checked = false;
};

document.getElementById("show-login").onclick = function () {
    form_checkbox.checked = true;
};


// Display the uploaded profile picture 
image_input.onchange = function () {

    // validate if a file was selected
    if (!image_input.files[0]) {
        return;
    }

    let reader = new FileReader();

    // save the image and display it
    reader.onload = function () {
        uploaded_image = reader.result;
        window.uploaded_image = uploaded_image;

        profile_pic.src = uploaded_image;
        profile_pic.style.display = "block";
        plus_icon.style.display = "none";
    };

    // convert image into readable format
    reader.readAsDataURL(image_input.files[0]);
};

// store the user's data in local storage 
function StoreUser() {
    // create object to store user details
    let UserObject = {};

    // the fields which need to be stored
    UserObject.fullname = document.getElementById("fullname").value;
    UserObject.username = document.getElementById("username").value;
    UserObject.email = document.getElementById("email").value;
    UserObject.password = document.getElementById("password").value;
    UserObject.phone = document.getElementById("phone-number").value;
    UserObject.dob = document.getElementById("user_dob").value;

    // Save the uploaded profile picture
    UserObject.profileImage = uploaded_image;

    // store palyer's scores, and the levels completed 
    UserObject.levelScores = {1: 0, 2: 0, 3: 0 };
    UserObject.totalScore = 0;
    UserObject.completedLevels = [];

    // store user's info in local storage
    localStorage[UserObject.email] = JSON.stringify(UserObject);
    return true;
}

window.StoreUser = StoreUser;


