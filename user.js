/**
 *
 */

class User {
    username;
    password;
    record;

    /**
     *
     */
    constructor() {
        this.username = "";
        this.password = "";
        this.record = 0;
    }

    /**
     *
     * @returns {{password, record, username, image}}
     */
    createUser() {
        return {
            "username": this.username,
            "password": this.password,
            "record": this.record,
            "image": this.image
        };
    }
}

/**
 *
 */
class Storage {
    user;

    /**
     *
     */
    constructor() {
        this.user = new User();
    }

    /**
     *
     */
    waitForLogin() {
        handleEvents.clearErrorsAndInputs();
        submit.removeEventListener("click", this.callSignUp);
        submit.addEventListener("click", this.callLogin);
        handleEvents.toggleLoginButtons(true);
    }

    /**
     *
     */
    callSignUp = () => {
        this.signUp(this);
    }

    /**
     *
     */
    callLogin = () => {
        this.login(this);
    }

    /**
     *
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
     *
     * @param str
     * @returns {*}
     */
    escapeSpecialChars(str) {
        return str
            .replace(/&/g, "&")
            .replace(/</g, "<")
            .replace(/>/g, ">")
            .replace(/"/g, "\"")
            .replace(/'/g, "'");
    }

    /**
     *
     */
    login() {
        const username_value = this.escapeSpecialChars(username.value);
        const password_value = this.escapeSpecialChars(password.value);

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
     *
     */
    signUp() {
        if (loginValidation()) {
            if (localStorage.getItem(username.value)) {
                handleEvents.fillError(bad_username, "Account is already exists!");
            } else {
                this.user.username = this.escapeSpecialChars(username.value);
                this.user.password = this.escapeSpecialChars(password.value);

                localStorage.setItem(this.user.username, JSON.stringify(this.user.createUser()));

                sessionStorage.setItem("logged_in", this.user.username);
                handleEvents.hideLoginForm();
            }
        }
    }

    /**
     *
     */
    logOut() {
        location.reload();
        sessionStorage.removeItem("logged_in");
        handleEvents.hideGame();
        this.waitForSignUp();
    }

    /**
     *
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
     *
     */
    changePassword() {
        if (validateNewPassword()) {
            const user = this.getLoggedInUser();
            user.password = new_password.value;
            localStorage.removeItem(user.username);
            localStorage.setItem(user.username, JSON.stringify(user));
            window.alert("Password was successfully changed!");
        }
    }

    /**
     *
     */
    changeImage() {
        if (validateNewImage()) {
            const user = this.getLoggedInUser();
            const file = new_image.files[0];

            localStorage.removeItem(user.username);
            localStorage.setItem(user.username, JSON.stringify(user));

            const reader = new FileReader();

            reader.onload = function() {
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
     *
     * @returns {any}
     */
    getLoggedInUser() {
        const username = sessionStorage.getItem("logged_in");

        if (username) {
            return JSON.parse(localStorage[username])
        }
        return null;
    }

    /**
     *
     */
    changeUsername() {
        if (validateNewUsername()) {
            if (!localStorage.getItem(new_username.value)) {
                const user = this.getLoggedInUser();

                const old_username = user.username;
                const image = localStorage[old_username + "_image"];

                user.username = new_username.value;

                localStorage.removeItem(old_username);
                localStorage.removeItem(old_username + "_image")

                localStorage.setItem(user.username, JSON.stringify(user));
                localStorage.setItem(user.username + "_image", image);

                sessionStorage["logged_in"] = new_username.value;
                location.reload();
            } else {
                handleEvents.fillError(bad_new_username, "Account is already exists!");
            }
        }
    }
}

/**
 *
 */
class HandleEvents {

    login_form;
    nav;
    game_screen;
    menu_button;
    delete_account;
    logout;

    /**
     *
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
     *
     * @param field
     * @param message
     */
    fillError(field, message) {
        field.textContent = message;
    }

    /**
     *
     */
    showLoginForm() {
        this.login_form.style.display = "flex";
    }

    /**
     *
     */
    hideLoginForm() {
        this.login_form.style.display = "none";
        this.nav.style.display = "flex";
        this.game_screen.style.display = "flex";
        this.logout.style.display = "flex";
        handleEvents.showUsername();
        handleEvents.showImage();
    }

    /**
     *
     */
    hideGame() {
        this.logout.style.display = "none";
        this.nav.style.display = "none";
        this.game_screen.style.display = "none";
    }

    /**
     *
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
     *
     * @param forLogin
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
     *
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
     *
     */
    showUsername() {
        const username_show = document.querySelector(".user_name");
        username_show.textContent = sessionStorage.getItem("logged_in");
    }

    showImage() {console.log(localStorage)
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

window.onload = function() {
    document.location.hash = "";
}
