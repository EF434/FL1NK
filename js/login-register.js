
// Save the upladed image
let uploaded_image = "";
const image_input = document.querySelector("#profile-image");
const profile_circle = document.querySelector("#profile-circle");

profile_circle.onclick = () => {image_input.click();};
image_input.onchange = () => {
    const reader = new FileReader();

    reader.onload = () => {
        uploaded_image = reader.result;
        document.getElementById("profile-pic").src = uploaded_image;
        document.getElementById("profile-pic").style.display = "block";
        document.getElementById("plus-icon").style.display = "none";
    };

    reader.readAsDataURL(image_input.files[0]);
};


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
    let CorrectFields = true   


    // Check profile picture
    if (!user_image.files[0]) {
        document.getElementById("profile-pic-error").textContent ="Please upload a profile picture.";
        CorrectFields = false;
    }
    else if (!user_image.files[0].type.startsWith("image/")) {
        document.getElementById("profile-pic-error").textContent= "Please only select an image"
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
        "❌ Please enter a valid full name!"
        CorrectFields = false   
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
        "Username must be 3-10 characters"
         CorrectFields = false   
    }

    // Check email
    if (email.trim() === "") {
        document.getElementById("email-error").innerHTML =
        "❌ Please enter your email.";
        CorrectFields = false;

    } else if (!emailRegex.test(email)) {
        document.getElementById("email-error").innerHTML =
        "❌ Please eneter a valid email! "
         CorrectFields = false  

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
        "❌ Password must be 6+ characters with uppercase, lowercase & a number."
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
        document.getElementById("confirm-password-error").textContent = "Passwords do not match.";
        CorrectFields = false;
    }

    // Check phone number
    if (phone.trim() === "") {
        document.getElementById("number-error").innerHTML =
            "❌ Phone Number field can't be empty.";
        CorrectFields = false;

    } else if (!phoneRegex.test(phone)) {
        document.getElementById("number-error").textContent =
            "Invalid UAE number. E.g., +971523080212"
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
        StoreUser();

        // Display register sucessful message 
        document.getElementById("success-message").textContent =`Registration Successful, ${username}!`;
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
function StoreUser(){
    // create object to store user details
    let UserObject = {};

    // the fields which we gonna store
    UserObject.fullname = document.getElementById("fullname").value;
    UserObject.username = document.getElementById("username").value;
    UserObject.email = document.getElementById("email").value;
    UserObject.password = document.getElementById("password").value;
    UserObject.phone = document.getElementById("phone-number").value;
    UserObject.dob = document.getElementById("user_dob").value;

    // store user info
    localStorage[UserObject.email] = JSON.stringify(UserObject)

}
// login functionality
function login(){

    let email = document.getElementById("loginEmail").value
    let password = document.getElementById("passwordInput").value;


    // Clear previous messages
    document.getElementById("loginFailure").textContent = "";
    document.getElementById("loginPara").textContent = "";

    // verify if user has account
    if(localStorage[email] == undefined){
        // inform user about unsucesssful login
        document.getElementById("loginFailure").innerHTML = 
        "Email not found! Register first to proceed"
        return;
    } 

    else{

        // convert to object
        let UserObject = JSON.parse(localStorage[email]);

        // sucessful login 
        if (password === UserObject.password){
            document.getElementById("loginPara").innerHTML = UserObject.email + "logged in successfully!";
            sessionStorage.loggedInUserEmail = UserObject.email;
        }
        else {
            document.getElementById("loginFailure").innerHTML =  "Password not correct! Try again.";
        }
        
    }   
}

// show passowrd when user clicks eye icon
function showPassword(){
    let password = document.getElementById("login-password");
    let display_eye = document.getElementById("eye-icon");

    if (password.type === "password"){
        password.type = "text";
    }
    else{
        password.type = "password"
    }
}
// Running this function when the window loads
window.onload = init;



