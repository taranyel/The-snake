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
    sign_up;
    log_in;
    logout;
    submit;
    form;
    username;
    password;
    bad_username;
    bad_password;
    new_game;
    pause_game;
    finish_game;
    continue_game;

    constructor() {
        this.user = new User();
        this.logout = document.getElementById("logout_button");
        this.form = document.querySelector(".form");
        this.submit = document.getElementById("submit");
        this.log_in = document.getElementById("login_button");
        this.sign_up = document.getElementById("sign_up_button");
        this.username = document.getElementById("username");
        this.password = document.getElementById("password");
        this.bad_username = document.getElementById("bad_username");
        this.bad_password = document.getElementById("bad_password");
        this.new_game = document.getElementById("new_game");
        this.pause_game = document.getElementById("pause_game");
        this.finish_game = document.getElementById("finish_game");
        this.continue_game = document.getElementById("continue_game");

        this.log_in.addEventListener("click", this.waitForLogin.bind(this));
        this.sign_up.addEventListener("click", this.showForm.bind(this));
        this.logout.addEventListener("click", this.logOut.bind(this));
    }

    hideForm() {
        this.form.style.display = "none";
        this.new_game.style.display = "block";
        this.pause_game.style.display = "block";
        this.finish_game.style.display = "block";
        this.continue_game.style.display = "block";
        this.showLogout();
    }

    waitForLogin() {
        this.clearErrors();
        this.clearInputs();

        this.submit.removeEventListener("click", this.callSignUp);
        this.submit.addEventListener("click", this.callLogin);
        this.sign_up.style.backgroundColor = "white";
        this.log_in.style.backgroundColor = "red";
    }

    callSignUp = () => {
        this.signUp(this);
    }

    callLogin = () => {
        this.login(this);
    }

    clearErrors() {
        if (this.bad_username && this.bad_password) {
            this.bad_password.textContent = "";
            this.bad_username.textContent = "";
        }
    }

    clearInputs() {
        this.username.textContent = "";
        this.password.textContent = "";
    }

    showForm() {
        this.clearErrors();
        this.clearInputs();

        this.log_in.style.backgroundColor = "white";
        this.sign_up.style.backgroundColor = "red";

        if (!sessionStorage.getItem("logged_in")) {
            this.form.style.display = "block";
            this.submit.removeEventListener("click", this.callLogin);
            this.submit.addEventListener("click", this.callSignUp);
        } else {
            this.hideForm();
        }
    }

    showLogout() {
        this.logout.style.display = "contents";
    }

    login() {
        const username_value = this.username.value;
        const password_value = this.password.value;

        const storage_user = localStorage.getItem(username_value);
        if (!storage_user) {
            this.bad_username.textContent = "bad username";

        } else {
            const storage_user_json = JSON.parse(storage_user);
            if (password_value !== storage_user_json.password) {
                this.bad_password.textContent = "bad password";

            } else {
                sessionStorage.setItem("logged_in", username_value);
                this.hideForm();
            }
        }
    }

    signUp() {
        this.user.username = this.username.value;
        this.user.password = this.password.value;
        localStorage.setItem(this.user.username, JSON.stringify(this.user.createUser()));

        sessionStorage.setItem("logged_in", this.user.username);
        this.hideForm();
    }

    logOut() {
        sessionStorage.removeItem("logged_in");
        this.logout.style.display = "none";
        this.new_game.style.display = "none";
        this.pause_game.style.display = "block";
        this.finish_game.style.display = "block";
        this.continue_game.style.display = "block";
        this.showForm();
    }
}

const storage = new Storage();
storage.showForm();
