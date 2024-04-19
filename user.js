class User {
    username;
    password;

    constructor() {
        this.username = "";
        this.password = "";
    }

    createUser() {
        return {
            "username": this.username,
            "password": this.password
        };
    }
}

class Storage {
    user;
    logout;
    form;
    description_form;
    // new_game;
    // pause_game;
    // finish_game;
    // continue_game;
    game_screen;
    nav;

    constructor() {
        this.user = new User();
        this.logout = document.getElementById("logout_button");
        this.form = document.querySelector(".form");
        this.description_form = document.querySelector(".description_form");
        // this.new_game = document.getElementById("new_game");
        // this.pause_game = document.getElementById("pause_game");
        // this.finish_game = document.getElementById("finish_game");
        // this.continue_game = document.getElementById("continue_game");
        this.nav = document.querySelector("nav");
        this.game_screen = document.querySelector(".game");

        log_in.addEventListener("click", this.waitForLogin.bind(this));
        sign_up.addEventListener("click", this.showForm.bind(this));
        this.logout.addEventListener("click", this.logOut.bind(this));
    }

    hideForm() {
        this.form.style.display = "none";
        this.description_form.style.display = "none";
        // this.new_game.style.display = "block";
        // this.pause_game.style.display = "block";
        // this.finish_game.style.display = "block";
        // this.continue_game.style.display = "block";
        this.nav.style.display = "flex";
        this.game_screen.style.display = "block";
        this.logout.style.display = "flex";
    }

    waitForLogin() {
        this.clearErrorsAndInputs();

        submit.removeEventListener("click", this.callSignUp);
        submit.addEventListener("click", this.callLogin);
        sign_up.className = "non_active";
        log_in.className = "login_active";
    }

    callSignUp = () => {
        this.signUp(this);
    }

    callLogin = () => {
        this.login(this);
    }

    clearErrorsAndInputs() {
        bad_password.textContent = "";
        bad_username.textContent = "";
        username.value = "";
        password.value = "";
    }

    showForm() {
        this.clearErrorsAndInputs();

        log_in.className = "non_active";
        sign_up.className = "signup_active";

        if (!sessionStorage.getItem("logged_in")) {
            this.form.style.display = "flex";
            this.description_form.style.display = "block";
            submit.removeEventListener("click", this.callLogin);
            submit.addEventListener("click", this.callSignUp);
        } else {
            this.hideForm();
        }
    }

    login() {
        const username_value = username.value;
        const password_value = password.value;

        if (validation()) {
            const storage_user = localStorage.getItem(username_value);
            if (!storage_user) {
                bad_username.textContent = "Wrong username!";
                submit.className = "error";

            } else {
                const storage_user_json = JSON.parse(storage_user);
                if (password_value !== storage_user_json.password) {
                    bad_password.textContent = "Wrong password!";

                } else {
                    sessionStorage.setItem("logged_in", username_value);
                    this.hideForm();
                }
            }
        }
    }

    signUp() {
        if (validation()) {
            const storage_user = localStorage.getItem(username.value);
            if (storage_user) {
                bad_username.textContent = "Account is already exists!"
            } else {
                this.user.username = username.value;
                this.user.password = password.value;

                localStorage.setItem(this.user.username, JSON.stringify(this.user.createUser()));

                sessionStorage.setItem("logged_in", this.user.username);
                this.hideForm();
            }
        }
    }

    logOut() {
        sessionStorage.removeItem("logged_in");
        this.logout.style.display = "none";
        // this.new_game.style.display = "none";
        // this.pause_game.style.display = "none";
        // this.finish_game.style.display = "none";
        // this.continue_game.style.display = "none";
        this.nav.style.display = "none";
        this.game_screen.style.display = "none";
        this.showForm();
    }
}

const storage = new Storage();
storage.showForm();
