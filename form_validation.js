const username = document.getElementById("username");
const password = document.getElementById("password");
const new_username = document.getElementById("change_username_field");
const new_password = document.getElementById("change_password_field");
const new_image = document.getElementById("change_image_field");
const submit = document.getElementById("submit");

const bad_username = document.getElementById("bad_username");
const bad_password = document.getElementById("bad_password");
const bad_new_username = document.getElementById("bad_new_username");
const bad_new_password = document.getElementById("bad_new_password");
const bad_new_image = document.getElementById("bad_new_image");


/**
 * Escapes special html characters for defence from XML Injection.
 *
 * @param str - given string from user
 * @returns {String} - safe string
 */
function escapeSpecialChars(str) {
    return str
        .replace(/&/g, "&")
        .replace(/</g, "<")
        .replace(/>/g, ">")
        .replace(/"/g, "\"")
        .replace(/'/g, "'");
}

/**
 * Validates username.
 *
 * @param username - given username from user
 * @returns {String} - returns username value if validation passed
 */
function validateUsername(username) {
    if (!username) {
        bad_username.textContent = "You must fill this field!";
    } else {
        if (username.length < 4) {
            bad_username.textContent = "Must contain at least 4 characters!"
        } else if (username.length > 10) {
            bad_username.textContent = "Maximum 10 characters are allowed!"
        } else {
            return username.value;
        }
    }
    return null;
}

/**
 * Validates password.
 *
 * @param password - given password from user
 * @returns {String} - returns password value if validation passed
 */
function validatePassword(password) {
    if (!password) {
        bad_password.textContent = "You must fill this field!";
    } else {
        if (password.length < 5) {
            bad_password.textContent = "Must contain at least 5 characters!"
        } else if (password.length > 15) {
            bad_password.textContent = "Maximum 15 characters are allowed!"
        } else {
            return password.value;
        }
    }
    return null;
}

/**
 * Calls validation function for validation new username.
 *
 * @returns {String} - returns new username value if validation passed
 */
function validateNewUsername() {
    return validateUsername(escapeSpecialChars(new_username.value));
}

/**
 * Calls validation function for validation new password.
 *
 * @returns {String} - returns new password value if validation passed
 */
function validateNewPassword() {
    return validatePassword(escapeSpecialChars(new_password.value));
}

/**
 * Validates image given from user.
 *
 * @returns {boolean} - returns <b>true</b> if validation passed, otherwise returns <b>false</b>.
 */
function validateNewImage() {
    if (new_image.files.length === 0) {
        bad_new_image.textContent = "Please upload new image";
        return false;
    }

    const new_file = new_image.files[0];
    if (new_file.type.substring(0, 5) !== "image") {
        bad_new_image.textContent = "File must be an image!";
        return false;
    }

    return true;
}

/**
 * Calls functions for username and password validation given from user.
 *
 * @returns {String[]} - returns username and password values if validation passed
 */
function signUpValidation() {
    return [validateUsername(escapeSpecialChars(username.value)),validatePassword(escapeSpecialChars(password.value))];
}