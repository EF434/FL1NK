"use strict";

///////////////////////////////////////////////////
// Validate user unput for registeration and login
// And display password when user clicks eye icon
///////////////////////////////////////////////////
export function processInput() {
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
            "❌ Please upload a profile picture.";
        CorrectFields = false;
    }
    else if (!user_image.files[0].type.startsWith("image/")) {
        document.getElementById("profile-pic-error").textContent =
            "❌ Please only select an image";
        CorrectFields = false;
    }
    else if (!window.uploaded_image) {
        document.getElementById("profile-pic-error").textContent =
            "❌ Please wait for your profile picture to load.";
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
    const current_year = new Date().getFullYear();
    const birth_year = Number(dob.slice(0, 4));

    if (dob === "") {
        document.getElementById("dob-error").textContent =
            "❌ Please enter your date of birth.";
        CorrectFields = false;
    } else if (birth_year >= current_year) {
        document.getElementById("dob-error").textContent =
            "❌ Invalid date of birth. Please enter atleast a date from a previous year.";
        CorrectFields = false;
    }

    // Display feedback message after all fields are correct
    if (CorrectFields) {

        // Save the account only when registration is valid
        let accountSaved = window.StoreUser();
        let sucess_message = document.getElementById("success-message");
        if (accountSaved) {
            
            // Display register sucessful message
            sucess_message.innerHTML = `Yayy! Registration Successful, ${username}! Please log in. 🎉`;
            document.getElementById("sparkle-confetti").classList.add("falling");
        }
    }
}

// login functionality
export function login() {
    // get data from the login form
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

    // check password and display message accordinlgy
    if (password != UserObject.password) {
        loginFeedback.textContent = "Password is not correct! Try again!";
        return;
    }

    // create session sotrage and redurect to game page
    sessionStorage.setItem("loggedInUserEmail", UserObject.email);
    window.location.href = "play_game.html";

    }

// show passowrd when user clicks eye icon
function showPassword(eye, passwordId) {

    let password = document.getElementById(passwordId);

    // convert the passowrd type into text
    if (password.type == "password") {
        password.type = "text";
        eye.name = "eye-off-outline";
    }
    else {
        password.type = "password";
        eye.name = "eye-outline";
    }
}

window.showPassword = showPassword;