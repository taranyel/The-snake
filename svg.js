/**
 *
 */
(function createLogo(){
    const header = document.querySelector("header");
    const xmlns = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(xmlns, "svg");
    svg.setAttributeNS(null, "id", "logo_svg");

    const defs = document.createElementNS(xmlns, "defs");
    const linearGradient = document.createElementNS(xmlns, "linearGradient");

    linearGradient.setAttributeNS(null, "id", "logo_gradient");
    linearGradient.setAttributeNS(null, "x1", "13");
    linearGradient.setAttributeNS(null, "y1", "193.49992");
    linearGradient.setAttributeNS(null, "x2", "307");
    linearGradient.setAttributeNS(null, "y2", "193.49992");
    linearGradient.setAttributeNS(null, "gradientUnits", "userSpaceOnUse");

    const stop1 = document.createElementNS(xmlns, "stop");
    stop1.setAttributeNS(null, "offset", "0");
    stop1.setAttributeNS(null, "id", "logo_color1");

    const stop2 = document.createElementNS(xmlns, "stop");
    stop2.setAttributeNS(null, "offset", "1");
    stop2.setAttributeNS(null, "id", "logo_color2");

    linearGradient.append(stop1, stop2);
    defs.append(linearGradient);

    const path = document.createElementNS(xmlns, "path");
    path.setAttributeNS(null, "id", "logo_path");
    path.setAttributeNS(null, "d", "M 70 40\n" +
        "C 70 85, 140 85, 140 40" +
        "C 140 5, 80 5, 83 40" +
        "C 87 67, 127 67, 127 40" +
        "C 125 23, 95 23, 97 40" +
        "C 100 50, 115 50, 120 40" +
        "Q 155 0, 185 40" +
        "T 245 40" +
        "T 305 40" +
        "T 370 40" +
        "T 435 40");

    svg.append(defs, path);
    header.append(svg);
})()


const login_path = document.getElementById("login_path");
const log_in = document.getElementById("login_button");
const sign_up = document.getElementById("sign_up_button");

/**
 *
 */
document.getElementById("username").addEventListener('focus', function (e) {
    login_path.style.strokeDashoffset = "0px";
    login_path.style.strokeDasharray = "240, 1386";
});

/**
 *
 */
document.getElementById("password").addEventListener('focus', function (e) {
    login_path.style.strokeDashoffset = "-344px";
    login_path.style.strokeDasharray = "240, 1386";
});

/**
 *
 */
document.getElementById("submit").addEventListener('focus', function (e) {
    login_path.style.strokeDashoffset = "-730px";
    login_path.style.strokeDasharray = "530, 1386";
});

const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");

log_in.addEventListener("click", changeLoginColor);
sign_up.addEventListener("click", changeSignupColor);


/**
 *
 */
function changeLoginColor() {
    color1.style.stopColor = "#ff00ff";
    color2.style.stopColor = "#ff0000";
}

/**
 *
 */
function changeSignupColor() {
    color1.style.stopColor = "#fffb00";
    color2.style.stopColor = "#37ff00";
}

const logo_path = document.getElementById("logo_path");
/**
 *
 */
logo_path.addEventListener("click", function (e) {
    if (logo_path.style.strokeDashoffset === "0") {
        logo_path.style.strokeDashoffset = "-827px";
    } else {
        logo_path.style.strokeDashoffset = "0";
    }
})

