class User {
    username;
    password;
    record;

    constructor() {
        this.username = "";
        this.password = "";
        this.record = 0;
    }

    createUser() {
        return {
            "username": this.username,
            "password": this.password,
            "record": this.record
        };
    }
}

class Storage {
    user;
    password;

    constructor() {
        this.user = new User();
    }

    waitForLogin() {
        handleEvents.clearErrorsAndInputs();
        handleEvents.toggleSubmit(true);
        handleEvents.toggleButtons(true);
    }

    callSignUp = () => {
        this.signUp(this);
    }

    callLogin = () => {
        this.login(this);
    }

    waitForSignUp() {
        handleEvents.clearErrorsAndInputs();
        handleEvents.toggleButtons(false);

        if (!sessionStorage.getItem("logged_in")) {
            handleEvents.showLoginForm();
            handleEvents.toggleSubmit(false);
        } else {
            handleEvents.hideLoginForm();
        }
    }

    login() {
        const username_value = username.value;
        const password_value = password.value;

        if (validation()) {
            const storage_user = localStorage.getItem(username_value);
            if (!storage_user) {
                handleEvents.fillError(bad_username, "Wrong username!");

            } else {
                const storage_user_json = JSON.parse(storage_user);
                if (password_value !== storage_user_json.password) {
                    handleEvents.fillError(bad_password, "Wrong password!");

                } else {
                    sessionStorage.setItem("logged_in", username_value);
                    handleEvents.hideLoginForm();
                }
            }
        }
    }

    signUp() {
        if (validation()) {
            if (localStorage.getItem(username.value)) {
                handleEvents.fillError(bad_username, "Account is already exists!");
            } else {
                this.user.username = username.value;
                this.user.password = password.value;

                localStorage.setItem(this.user.username, JSON.stringify(this.user.createUser()));

                sessionStorage.setItem("logged_in", this.user.username);
                handleEvents.hideLoginForm();
            }
        }
    }

    logOut() {
        sessionStorage.removeItem("logged_in");
        handleEvents.hideGame();
        this.waitForSignUp();
    }

    changePassword() {
        if (validatePassword()) {
            const user = this.getLoggedInUser();
            user.password = password.value;
            localStorage.removeItem(user.username);
            localStorage.setItem(user.username, JSON.stringify(user));
        }
    }

    getLoggedInUser() {
        const username = sessionStorage.getItem("logged_in");
        return JSON.parse(localStorage[username])
    }

    changeUsername() {
        if (validateUsername()) {
            if (!localStorage.getItem(username.value)) {
                const user = this.getLoggedInUser();
                const old_username = user.username;
                user.username = username.value;
                localStorage.removeItem(old_username);
                localStorage.setItem(user.username, JSON.stringify(user));
            } else {
                handleEvents.fillError(bad_username, "Account is already exists!");
            }
        }
    }
}


class HandleEvents {

    logout;
    login_form;
    nav;
    game_screen;
    menu_button;
    change_username_button;
    change_username_form;
    change_password_button;
    change_password_form;
    submit_new_username;
    submit_new_password;
    menu;

    constructor() {
        this.logout = document.getElementById("logout_button");
        this.login_form = document.querySelector(".forms");
        this.nav = document.querySelector("nav");
        this.game_screen = document.querySelector(".game_block");
        this.menu_button = document.getElementById("menu_button");
        this.menu = document.getElementById("menu");
        this.change_username_button = document.getElementById("change_username_button");
        this.change_password_button = document.getElementById("change_password_button");
        this.change_username_form = document.getElementById("change_username_form");
        this.change_password_form = document.getElementById("change_password_form");
        this.submit_new_username = document.getElementById("submit_new_username");
        this.submit_new_password = document.getElementById("submit_new_password");

        log_in.addEventListener("click", storage.waitForLogin.bind(storage));
        sign_up.addEventListener("click", storage.waitForSignUp.bind(storage));
        this.logout.addEventListener("click", storage.logOut.bind(storage));
        this.menu_button.addEventListener("click", this.toggleMenu.bind(this));
        this.change_username_button.addEventListener("click", this.showChangeUsernameForm.bind(this));
        this.change_password_button.addEventListener("click", this.showChangePasswordForm.bind(this));
        this.submit_new_username.addEventListener("click", storage.changeUsername.bind(storage));
        this.submit_new_password.addEventListener("click", storage.changePassword.bind(storage));
    }

    fillError(field, message) {
        field.textContent = message;
    }

    showLoginForm() {
        this.login_form.style.display = "flex";
    }

    showChangeUsernameForm() {

        this.change_username_form.style.display = "flex";
    }

    showChangePasswordForm() {
        this.change_password_form.style.display = "flex";
    }

    hideLoginForm() {
        this.login_form.style.display = "none";
        this.nav.style.display = "flex";
        this.game_screen.style.display = "flex";
        this.logout.style.display = "flex";
    }

    hideGame() {
        this.logout.style.display = "none";
        this.nav.style.display = "none";
        this.game_screen.style.display = "none";
    }

    clearErrorsAndInputs() {
        bad_password.textContent = "";
        bad_username.textContent = "";
        username.value = "";
        password.value = "";
    }

    toggleSubmit(forLogin) {
        if (forLogin) {
            submit.removeEventListener("click", storage.callSignUp);
            submit.addEventListener("click", storage.callLogin);
        } else {
            submit.removeEventListener("click", storage.callLogin);
            submit.addEventListener("click", storage.callSignUp);
        }
    }

    toggleButtons(forLogin) {
        if (forLogin) {
            sign_up.className = "non_active";
            log_in.className = "login_active";
        } else {
            log_in.className = "non_active";
            sign_up.className = "signup_active";
        }
    }

    toggleMenu() {
        if (this.menu.className === "closed") {
            this.menu.style.display = "flex";
            this.menu.className = "opened"
            this.menu_button.src = "images/menu_opened.png";
        } else {
            this.menu.style.display = "none";
            this.menu.className = "closed";
            this.menu_button.src = "images/menu_closed.png";
        }
    }
}

const storage = new Storage();
const handleEvents = new HandleEvents();
storage.waitForSignUp();
