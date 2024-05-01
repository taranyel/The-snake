const login_path = document.getElementById("login_path");
const log_in = document.getElementById("login_button");
const sign_up = document.getElementById("sign_up_button");

document.getElementById("username").addEventListener('focus', function (e) {
    login_path.style.strokeDashoffset = "0px";
    login_path.style.strokeDasharray = "240, 1386";
});

document.getElementById("password").addEventListener('focus', function (e) {
    login_path.style.strokeDashoffset = "-344px";
    login_path.style.strokeDasharray = "240, 1386";
});

document.getElementById("submit").addEventListener('focus', function (e) {
    login_path.style.strokeDashoffset = "-730px";
    login_path.style.strokeDasharray = "530, 1386";
});

const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");

log_in.addEventListener("click", changeLoginColor);
sign_up.addEventListener("click", changeSignupColor);

function changeLoginColor() {
    color1.style.stopColor = "#ff00ff";
    color2.style.stopColor = "#ff0000";
}

function changeSignupColor() {
    color1.style.stopColor = "#fffb00";
    color2.style.stopColor = "#37ff00";
}

const logo_path = document.getElementById("logo_path");
logo_path.addEventListener("click", function (e) {
    if (logo_path.style.strokeDashoffset === "0") {
        logo_path.style.strokeDashoffset = "-827px";
    } else {
        logo_path.style.strokeDashoffset = "0";
    }
})

