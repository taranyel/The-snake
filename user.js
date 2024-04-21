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

    constructor() {
        this.user = new User();
    }

    waitForLogin() {
        handleEvents.clearErrorsAndInputs();
        submit.removeEventListener("click", this.callSignUp);
        submit.addEventListener("click", this.callLogin);
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
            submit.removeEventListener("click", this.callLogin);
            submit.addEventListener("click", this.callSignUp);
        } else {
            handleEvents.hideLoginForm();
        }
    }

    login() {
        const username_value = username.value;
        const password_value = password.value;

        if (loginValidation()) {
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
    }

    signUp() {
        if (loginValidation()) {
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
        if (validateNewPassword()) {
            const user = this.getLoggedInUser();
            user.password = new_password.value;
            localStorage.removeItem(user.username);
            localStorage.setItem(user.username, JSON.stringify(user));
            handleEvents.hideChangePasswordForm();
        }
    }

    getLoggedInUser() {
        const username = sessionStorage.getItem("logged_in");
        return JSON.parse(localStorage[username])
    }

    changeUsername() {
        console.log(localStorage)
        if (validateNewUsername()) {
            if (!localStorage.getItem(username.value)) {
                const user = this.getLoggedInUser();
                const old_username = user.username;
                user.username = new_username.value;
                localStorage.removeItem(old_username);
                localStorage.setItem(user.username, JSON.stringify(user));
                handleEvents.hideChangeUsernameForm();
            } else {
                handleEvents.fillError(bad_new_username, "Account is already exists!");
            }
        }
        console.log(localStorage)
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
        this.menu = document.querySelector(".menu");
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
        this.change_username_button.addEventListener("click", this.toggleChangeUsernameForm.bind(this));
        this.change_password_button.addEventListener("click", this.toggleChangePasswordForm.bind(this));
        this.submit_new_username.addEventListener("click", storage.changeUsername.bind(storage));
        this.submit_new_password.addEventListener("click", storage.changePassword.bind(storage));
    }

    fillError(field, message) {
        field.textContent = message;
    }

    showLoginForm() {
        this.login_form.style.display = "flex";
    }

    hideChangeUsernameForm() {
        this.change_username_form.style.display = "none";
    }

    hideChangePasswordForm() {
        this.change_password_form.style.display = "none";
    }

    toggleChangeUsernameForm() {
        if (this.change_username_button.className === "closed") {
            this.change_username_button.className = "opened";
            this.clearErrorsAndInputs();
            this.change_username_form.style.display = "flex";
        } else {
            this.change_username_button.className = "closed"
            this.hideChangeUsernameForm();
        }
    }

    toggleChangePasswordForm() {
        if (this.change_password_button.className === "closed") {
            this.change_password_button.className = "opened";
            this.clearErrorsAndInputs();
            this.change_password_form.style.display = "flex";
        } else {
            this.change_password_button.className = "closed";
            this.hideChangePasswordForm();
        }
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
        bad_new_username.textContent = "";
        bad_new_password.textContent = "";
        username.value = "";
        password.value = "";
        new_username.value = "";
        new_password.value = "";
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
        if (this.menu.classList.contains("opened")) {
            this.menu.classList.remove("opened");
            this.menu_button.src = "images/menu_closed.png";
        } else {
            this.hideChangePasswordForm();
            this.hideChangeUsernameForm();
            this.menu.classList.add("opened");
            this.menu_button.src = "images/menu_opened.png";
        }
    }
}

const storage = new Storage();
const handleEvents = new HandleEvents();
storage.waitForSignUp();
