const username = document.querySelector(".username");
const password = document.querySelector(".password");
const submit = document.querySelector(".submit");
const bad_username = document.querySelector(".bad_username");
const bad_password = document.querySelector(".bad_password");
bad_username.textContent = "";
bad_password.textContent = "";

function validateUsername() {
    if (!username.value) {
        bad_username.textContent = "You must fill this field!";
    } else {
        if (username.value.length < 4) {
            bad_username.textContent = "Must contain at least 4 characters!"
        } else if (username.value.length > 10) {
            bad_username.textContent = "Maximum 10 characters are allowed!"
        } else {
            return true;
        }
    }
    return false;
}

function validatePassword() {
    if (!password.value) {
        bad_password.textContent = "You must fill this field!";
    } else {
        if (password.value.length < 5) {
            bad_password.textContent = "Must contain at least 5 characters!"
        } else if (password.value.length > 15) {
            bad_password.textContent = "Maximum 15 characters are allowed!"
        } else {
            return true;
        }
    }
    return false;
}

function validation() {
    return validatePassword() && validateUsername();
}