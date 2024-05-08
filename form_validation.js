const username = document.getElementById("username");
const password = document.getElementById("password");
const new_username = document.getElementById("change_username_field");
const new_password = document.getElementById("change_password_field");
const submit = document.getElementById("submit");
const bad_username = document.getElementById("bad_username");
const bad_password = document.getElementById("bad_password");
const bad_new_username = document.getElementById("bad_new_username");
const bad_new_password = document.getElementById("bad_new_password");

/**
 *
 * @param username
 * @param bad_username
 * @returns {boolean}
 */
function validateUsername(username, bad_username) {
    if (!username) {
        bad_username.textContent = "You must fill this field!";
    } else {
        if (username.length < 4) {
            bad_username.textContent = "Must contain at least 4 characters!"
        } else if (username.length > 10) {
            bad_username.textContent = "Maximum 10 characters are allowed!"
        } else {
            return true;
        }
    }
    return false;
}

/**
 *
 * @param password
 * @param bad_password
 * @returns {boolean}
 */
function validatePassword(password, bad_password) {
    if (!password) {
        bad_password.textContent = "You must fill this field!";
    } else {
        if (password.length < 5) {
            bad_password.textContent = "Must contain at least 5 characters!"
        } else if (password.length > 15) {
            bad_password.textContent = "Maximum 15 characters are allowed!"
        } else {
            return true;
        }
    }
    return false;
}

/**
 *
 *
 * @returns {boolean}
 */
function validateNewUsername() {
    return validateUsername(new_username.value, bad_new_username);
}

/**
 *
 * @returns {boolean}
 */
function validateNewPassword() {
    return validatePassword(new_password.value, bad_new_password);
}

/**
 *
 * @returns {boolean}
 */
function loginValidation() {
    return validateUsername(username.value, bad_username) && validatePassword(password.value, bad_password);
}