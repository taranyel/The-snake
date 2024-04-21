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
            handleEvents.showForm();
            handleEvents.toggleSubmit(false);
        } else {
            handleEvents.hideForm();
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
                    handleEvents.hideForm();
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
                handleEvents.hideForm();
            }
        }
    }

    logOut() {
        sessionStorage.removeItem("logged_in");
        handleEvents.hideGame();
        this.waitForSignUp();
    }

    changePassword(new_password) {
        this.user.password = new_password;
    }

    changeUsername(new_username) {
        if (!localStorage.getItem(new_username)) {
            localStorage.removeItem(this.user.username);
            this.user.username = new_username;
            localStorage.setItem(this.user.username, JSON.stringify(this.user.createUser()));
        } else {

        }
    }
}


class HandleEvents {

    logout;
    form;
    nav;
    game_screen;
    menu_button;
    menu;

    constructor() {
        this.logout = document.getElementById("logout_button");
        this.form = document.querySelector(".forms");
        this.nav = document.querySelector("nav");
        this.game_screen = document.querySelector(".game_block");
        this.menu_button = document.getElementById("menu_button");
        this.menu = document.getElementById("menu");

        log_in.addEventListener("click", storage.waitForLogin.bind(storage));
        sign_up.addEventListener("click", storage.waitForSignUp.bind(storage));
        this.logout.addEventListener("click", storage.logOut.bind(storage));
        this.menu_button.addEventListener("click", this.toggleMenu.bind(this));
    }

    fillError(field, message) {
        field.textContent = message;
    }

    showForm() {
        this.form.style.display = "flex";
    }

    hideForm() {
        this.form.style.display = "none";
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
