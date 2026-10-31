
"use strict";

// saving the image user uploaded
let uploaded_image = "";
const image_input = document.querySelector("#profile-image");
const profile_circle = document.querySelector("#profile-circle");
const profile_pic = document.getElementById("profile-pic");
const plus_icon = document.getElementById("plus-icon");
const user_pic = document.getElementById("user_pic");
const nav_profile_pic = document.getElementById("nav-profile-pic");

// Taking in the image user uplaoded and display it
image_input.onchange = () => {

    // check if user already uploaded image
    if (!image_input.files[0]) {
        return;
    }

    let reader = new FileReader();

    // display and store the image
    reader.onload = () => {

        uploaded_image = reader.result;

        profile_pic.src = uploaded_image;
        plus_icon.style.display = "none";
        user_pic.src = uploaded_image;
        nav_profile_pic.hidden = false;

        localStorage.setItem("profile_image", uploaded_image);
    };
    // read the uploaded image
    reader.readAsDataURL(image_input.files[0]);
};

// Loading the saved image and display it
let saved_image = localStorage.getItem("profile_image");

if (saved_image) {
    uploaded_image = saved_image;
    profile_pic.src = saved_image;
    plus_icon.style.display = "none";
    user_pic.src = saved_image;
    nav_profile_pic.hidden = false; 
}


function processInput() {
    // Get the data from all the input fields
    const user_image = document.querySelector("#profile-image");
    const fullname = document.querySelector("#fullname").value;
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirm_password = document.querySelector("#confirm-password").value;
    const phone = document.querySelector("#phone-number").value;
    const dob = document.querySelector("#user_dob").value;



    // Regex for validations
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,10}$/;
    const phoneRegex = /^\+9715\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // Clear previous error messages
    document.getElementById("profile-pic-error").innerHTML = "";
    document.getElementById("user-name-error").innerHTML = "";
    document.getElementById("username-error").innerHTML = "";
    document.getElementById("email-error").innerHTML = "";
    document.getElementById("password-error").innerHTML = "";
    document.getElementById("confirm-password-error").innerHTML = "";
    document.getElementById("dob-error").innerHTML = "";
    document.getElementById("number-error").innerHTML = "";

    // ensure all the fileds are correct before submitting form
    let CorrectFields = true;


    // Check profile picture
    if (!user_image.files[0]) {
        document.getElementById("profile-pic-error").textContent =
            "Please upload a profile picture.";
        CorrectFields = false;
    }
    else if (!user_image.files[0].type.startsWith("image/")) {
        document.getElementById("profile-pic-error").textContent =
            "Please only select an image";
        CorrectFields = false;
    }
    else if (!uploaded_image) {
        document.getElementById("profile-pic-error").textContent =
            "Please wait for your profile picture to load.";
        CorrectFields = false;
    }

    // Check full name
    if (fullname.trim() === "") {
        document.getElementById("user-name-error").innerHTML =
            "❌ Please enter your full name.";
        CorrectFields = false;
    }
    // confirm password with regex
    else if (!nameRegex.test(fullname)) {
        document.getElementById("user-name-error").innerHTML =
            "❌ Please enter a valid full name!";
        CorrectFields = false;
    }

    // Check username
    if (username.trim() === "") {
        document.getElementById("username-error").innerHTML =
            "❌ Please enter a username.";
        CorrectFields = false;
    }
    // confirm username with regex
    else if (!usernameRegex.test(username)) {
        document.getElementById("username-error").innerHTML =
            "Username must be 3-10 characters";
        CorrectFields = false;
    }

    // Check email
    if (email.trim() === "") {
        document.getElementById("email-error").innerHTML =
            "❌ Please enter your email.";
        CorrectFields = false;

    } else if (!emailRegex.test(email)) {
        document.getElementById("email-error").innerHTML =
            "❌ Please eneter a valid email! ";
        CorrectFields = false;

    } else if (localStorage[email] !== undefined) {
        document.getElementById("email-error").textContent =
            "❌ Account already registered! Please log in.";
        CorrectFields = false;
    }

    // Check password
    if (password === "") {
        document.getElementById("password-error").innerHTML =
            "❌ Please enter a password.";
        CorrectFields = false;

    } else if (!passwordRegex.test(password)) {
        document.getElementById("password-error").innerHTML =
            "❌ Password must be 6+ characters with uppercase, lowercase & a number.";
        CorrectFields = false;

    } else {
        document.getElementById("password-error").textContent = "";
    }

    // Compare enetrd password to re entered password
    if (confirm_password === "") {
        document.getElementById("confirm-password-error").innerHTML =
            "❌ Please Re-enter password to proceed";
        CorrectFields = false;
    } else if (confirm_password !== password) {
        document.getElementById("confirm-password-error").textContent =
            "Passwords do not match.";
        CorrectFields = false;
    }

    // Check phone number
    if (phone.trim() === "") {
        document.getElementById("number-error").innerHTML =
            "❌ Phone Number field can't be empty.";
        CorrectFields = false;

    } else if (!phoneRegex.test(phone)) {
        document.getElementById("number-error").textContent =
            "Invalid UAE number. E.g., +971523080212";
        CorrectFields = false;
    }

    // Check date of birth
    if (dob === "") {
        document.getElementById("dob-error").textContent =
            "Please enter your date of birth.";
        CorrectFields = false;

    } else if (dob > new Date().toISOString().slice(0, 10)) {
        document.getElementById("dob-error").textContent =
            "Invalid! Date can't be in future";
        CorrectFields = false;
    }

    // Display feedback message after all fields are correct
    if (CorrectFields) {

        // Save the account only when registration is valid
        let accountSaved = StoreUser();

        if (accountSaved) {
            // Display register sucessful message
            document.getElementById("success-message").textContent =
                `Registration Successful, ${username}! Please log in.`;
        }
    }
}


// Creating fucntion to add hover affect when user clicks the Sign Up and Login Label
function init() {
    const heading = document.querySelector('.main-section label[for="checkbox"]');

    // Affect when user clicks
    heading.onmouseover = () => {
        heading.style.color = "#472200";
        heading.style.textShadow = "0 0 12px #ff7c01";
    };

    // remove the affect when user clicks awat
    heading.onmouseout = () => {
        heading.style.color = "";
        heading.style.textShadow = "";
    };
}


// ========== Browser storage implemetion of the game
function StoreUser() {
    // create object to store user details
    let UserObject = {};

    // the fields which we gonna store
    UserObject.fullname = document.getElementById("fullname").value;
    UserObject.username = document.getElementById("username").value;
    UserObject.email = document.getElementById("email").value;
    UserObject.password = document.getElementById("password").value;
    UserObject.phone = document.getElementById("phone-number").value;
    UserObject.dob = document.getElementById("user_dob").value;

    // Save the uploaded profile picture
    UserObject.profileImage = uploaded_image;

    // Create the player's starting game scores
    UserObject.levelScores = {
        1: 0,
        2: 0,
        3: 0
    };

    UserObject.totalScore = 0;
    UserObject.completedLevels = [];

    // store user info
    try {
        localStorage[UserObject.email] = JSON.stringify(UserObject);
        return true;
    } catch (error) {
        document.getElementById("profile-pic-error").textContent =
            "Could not save account. Please try a smaller picture.";
        console.error("Registration storage error:", error);
        return false;
    }
}


// login functionality
function login() {

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("login-password").value;
    let loginFeedback = document.getElementById("loginFeedback");

    // Clear previous messages
    loginFeedback.textContent = "";

    // verify if user has account and display message
    if (localStorage[email] == undefined) {
        loginFeedback.textContent = "Email not found! Register first to proceed";
        return;
    }
    
    // getting registerd user's info
    let UserObject = JSON.parse(localStorage[email]);

    // check password and display meesage accordinlgy
    if (password != UserObject.password) {
        loginFeedback.textContent = "Password is not correct! Try again!";
        return;
    }
    
    loginFeedback.textContent = " Thank you ${UserObject.name} logged in successfully!";

    // create session sotrage for the logged in user
    sessionStorage.setItem("loggedInUserEmail", UserObject.email);

    // Redirect to the homepage to show the profile
    window.location.href = "play_game.html";
    }

// show passowrd when user clicks eye icon
function showPassword() {

    let password = document.getElementById("login-password");
    let display_eye = document.getElementById("eye-icon");

    if (password.type === "password") {
        password.type = "text";
        display_eye.setAttribute("name", "eye-off-outline");
    }
    else {
        password.type = "password";
        display_eye.setAttribute("name", "eye-outline");
    }
}


// Running this function when the window loads
window.onload = init;



/// <<< Display guest user popup if not regsitered >>>

// getting the popup image & button
let guestPopup = document.getElementById("guest_user_popup");
let guestButton = document.getElementById("guest_button");

if (guestPopup) {

    // checking if logged in already or continuing as guest
    let loggedInEmail = sessionStorage.getItem("loggedInUserEmail");
    let guestMode = sessionStorage.getItem("fl1nkGuestMode");

    guestPopup.style.display = "none";

    // display popup to new player
    if (loggedInEmail == null) {
        if (guestMode == null) {
            guestPopup.style.display = "flex";
        }
    }

    // session storage for guest user
    guestButton.onclick = function() {
        sessionStorage.setItem("fl1nkGuestMode", "true");
        guestPopup.style.display = "none";
    };
}