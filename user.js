/**
 * Class represents user.
 */
class User {
    username;
    password;
    record;

    /**
     * Constructor, sets username password and user record to default empty values
     */
    constructor() {
        this.username = "";
        this.password = "";
        this.record = 0;
    }

    /**
     * Makes json object from user.
     *
     * @returns {{password, record, username}} - returns user parameters in json format
     */
    createUser() {
        return {
            "username": this.username,
            "password": this.password,
            "record": this.record
        };
    }
}

/**
 * Class represents storage and manages storage functions.
 */
class Storage {
    user;

    /**
     * Constructor, creates new user.
     */
    constructor() {
        this.user = new User();
    }

    /**
     * Waits for login when login button is clicked.
     */
    waitForLogin() {
        handleEvents.clearErrorsAndInputs();
        submit.removeEventListener("click", this.callSignUp);
        submit.addEventListener("click", this.callLogin);
        handleEvents.toggleLoginButtons(true);
    }

    /**
     * Calls sign up function.
     */
    callSignUp = () => {
        this.signUp(this);
    }

    /**
     * Calls login function.
     */
    callLogin = () => {
        this.login(this);
    }

    /**
     * Waits for sign up, shows sign up form, when sign up button is clicked.
     */
    waitForSignUp() {
        handleEvents.clearErrorsAndInputs();
        handleEvents.toggleLoginButtons(false);

        if (!sessionStorage.getItem("logged_in")) {
            handleEvents.showLoginForm();
            submit.removeEventListener("click", this.callLogin);
            submit.addEventListener("click", this.callSignUp);
        } else {
            handleEvents.hideLoginForm();
        }
    }

    /**
     * Checks if values from user are correct, if yes, logs user in (sets user in session storage),
     * otherwise shows error message.
     */
    login() {
        const username_value = escapeSpecialChars(username.value);
        const password_value = escapeSpecialChars(password.value);

        const storage_user = localStorage.getItem(username_value);
        if (!storage_user) {
            handleEvents.fillError(bad_username, "Wrong username!");
        } else {
            const storage_user_json = JSON.parse(storage_user);
            if (password_value !== storage_user_json.password) {
                handleEvents.fillError(bad_password, "Wrong password!");
                handleEvents.fillError(bad_username, "");

            } else {
                sessionStorage.setItem("logged_in", username_value);
                handleEvents.hideLoginForm();
            }
        }
    }

    /**
     * Checks if values from user are correct, if yes, adds new user to the local storage and to the session storage,
     * otherwise shows error message.
     */
    signUp() {
        const validUserData = signUpValidation();
        if (validUserData[0] && validUserData[1]) {
            if (localStorage.getItem(validUserData[0])) {
                handleEvents.fillError(bad_username, "Account is already exists!");
            } else {
                this.user.username = validUserData[0];
                this.user.password = validUserData[1];

                localStorage.setItem(this.user.username, JSON.stringify(this.user.createUser()));
                sessionStorage.setItem("logged_in", this.user.username);

                handleEvents.hideLoginForm();
            }
        }
    }

    /**
     * Logs user out (removes user data from session storage) and shows sign up screen.
     */
    logOut() {
        location.reload();
        sessionStorage.removeItem("logged_in");
        handleEvents.hideGame();
        this.waitForSignUp();
    }

    /**
     * Asks user for account deletion, if user agrees, removes user data from local storage
     */
    deleteAccount() {
        if (window.confirm("Do you really want to delete your account?")) {
            const user = this.getLoggedInUser();
            localStorage.removeItem(user.username);
            localStorage.removeItem(user.username + "_image");
            this.logOut();
        }
    }

    /**
     * If new password from user is valid, changes user password and shows success message, otherwise shows error message.
     */
    changePassword() {
        const validNewPassword = validateNewPassword();
        if (validNewPassword) {
            const user = this.getLoggedInUser();
            user.password = validNewPassword;
            localStorage.removeItem(user.username);
            localStorage.setItem(user.username, JSON.stringify(user));
            window.alert("Password was successfully changed!");
        }
    }

    /**
     * If new image from user is valid, changes user image, otherwise shows error message.
     */
    changeImage() {
        if (validateNewImage()) {
            const user = this.getLoggedInUser();
            const file = new_image.files[0];

            localStorage.removeItem(user.username);
            localStorage.setItem(user.username, JSON.stringify(user));

            const reader = new FileReader();

            reader.onload = function () {
                if (reader.result.length > 3145728) {
                    bad_new_image.textContent = "Max. image size is 3MB";
                } else {
                    localStorage.setItem(user.username + "_image", reader.result);
                }
            }
            reader.readAsDataURL(file);
            location.reload();
        }
    }

    /**
     * Gets logged-in user from session storage.
     * @returns {any} - Returns logged-in user.
     */
    getLoggedInUser() {
        const username = sessionStorage.getItem("logged_in");

        if (username) {
            return JSON.parse(localStorage[username])
        }
        return null;
    }

    /**
     * If new username from user is valid, changes user username, otherwise shows error message.
     */
    changeUsername() {
        const validNewUsername = validateNewUsername();
        if (validNewUsername) {
            if (!localStorage.getItem(validNewUsername)) {
                const user = this.getLoggedInUser();

                const old_username = user.username;
                const image = localStorage[old_username + "_image"];

                user.username = validNewUsername;

                localStorage.removeItem(old_username);
                localStorage.removeItem(old_username + "_image")

                localStorage.setItem(user.username, JSON.stringify(user));
                localStorage.setItem(user.username + "_image", image);

                sessionStorage["logged_in"] = validNewUsername;
                location.reload();
            } else {
                handleEvents.fillError(bad_new_username, "Account is already exists!");
            }
        }
    }
}

/**
 * Class handles different events in the document.
 */
class HandleEvents {
    login_form;
    nav;
    game_screen;
    menu_button;
    delete_account;
    logout;
    start_game_sound;

    /**
     * Gets html elements from document and set event listeners to buttons and fields in forms.
     * Also shows username and image in menu section.
     */
    constructor() {
        this.logout = document.getElementById("logout_button");
        this.login_form = document.querySelector(".forms");
        this.nav = document.querySelector("nav");
        this.game_screen = document.querySelector(".game_block");
        this.menu_button = document.getElementById("menu_button");
        const submit_new_username = document.getElementById("submit_new_username");
        const submit_new_password = document.getElementById("submit_new_password");
        const submit_new_image = document.getElementById("submit_new_image");
        this.start_game_sound = document.getElementById("start_game_sound");

        this.delete_account = document.getElementById("delete_account");

        log_in.addEventListener("click", storage.waitForLogin.bind(storage));
        sign_up.addEventListener("click", storage.waitForSignUp.bind(storage));
        this.logout.addEventListener("click", storage.logOut.bind(storage));
        this.menu_button.addEventListener("click", this.toggleMenu.bind(this));

        submit_new_username.addEventListener("click", storage.changeUsername.bind(storage));
        submit_new_password.addEventListener("click", storage.changePassword.bind(storage));
        submit_new_image.addEventListener("click", storage.changeImage.bind(storage));

        this.delete_account.addEventListener("click", storage.deleteAccount.bind(storage));

        this.showUsername();
        this.showImage();
    }

    /**
     * Fills given error field with given error message.
     *
     * @param field - given error field
     * @param message - given error message
     */
    fillError(field, message) {
        field.textContent = message;
    }

    /**
     * Shows login form.
     */
    showLoginForm() {
        this.login_form.style.display = "flex";
    }

    /**
     * Plays start game sound, catches exceptions.
     */
    playStartGameSound() {
        this.start_game_sound.play().catch(error => {
            console.log("Sound cannot be played because of: ", error);
        });
    }

    /**
     * Completely stops start game sound.
     */
    stopStartGameSound() {
        console.log("huj")
        this.start_game_sound.pause();
        this.start_game_sound.currentTime = 0;
    }

    /**
     * Hides login form, shows username and image in the menu section.
     */
    hideLoginForm() {
        this.login_form.style.display = "none";
        this.nav.style.display = "flex";
        this.game_screen.style.display = "flex";
        this.logout.style.display = "flex";
        this.showUsername();
        this.showImage();

        this.playStartGameSound();
    }

    /**
     * Hides game screen.
     */
    hideGame() {
        this.logout.style.display = "none";
        this.nav.style.display = "none";
        this.game_screen.style.display = "none";
    }

    /**
     * Clears form fields and removes error messages.
     */
    clearErrorsAndInputs() {
        bad_password.textContent = "";
        bad_username.textContent = "";
        bad_new_username.textContent = "";
        bad_new_password.textContent = "";
        bad_new_image.textContent = "";
        username.value = "";
        password.value = "";
        new_image.value = "";
        new_username.value = "";
        new_password.value = "";
    }

    /**
     * Toggles buttons "login" and "sign up" according to user click.
     *
     * @param forLogin - if <b>true</b> sets login button as active, otherwise sets sign up button as active
     */
    toggleLoginButtons(forLogin) {
        if (forLogin) {
            sign_up.className = "non_active";
            log_in.className = "login_active";
        } else {
            log_in.className = "non_active";
            sign_up.className = "signup_active";
        }
    }

    /**
     * Toggles menu on click to the menu icon.
     */
    toggleMenu() {
        const menu = document.querySelector(".menu");

        if (menu.classList.contains("opened")) {
            menu.classList.remove("opened");
            this.menu_button.className = "fa fa-bars";
            document.location.hash = "";
        } else {
            menu.classList.add("opened");
            this.menu_button.className = "fa fa-times";
            this.clearErrorsAndInputs();
        }
    }

    /**
     * Shows username in the menu section.
     */
    showUsername() {
        const username_show = document.querySelector(".user_name");
        username_show.textContent = sessionStorage.getItem("logged_in");
    }

    /**
     * Shows image in the menu section, if user does not have its own image, default image will be shown.
     */
    showImage() {
        const image = document.querySelector(".user_data img");
        const user = storage.getLoggedInUser();

        if (user) {
            const user_image = localStorage.getItem(user.username + "_image");
            if (user_image) {
                image.src = user_image;
            } else {
                image.src = "images/default_icon.png";
            }
        }
    }
}

const storage = new Storage();
const handleEvents = new HandleEvents();
storage.waitForSignUp();

/**
 * Clears url hash.
 */
window.onload = function () {
    document.location.hash = "";
}
