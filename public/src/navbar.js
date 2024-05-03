const p = document.querySelector(".bottom-cont p");
const auth_cont = document.querySelector(".auth-cont");
const about_cont = document.querySelector(".about-cont");
const login_nav = document.querySelector(".login-nav");
const home_nav = document.querySelector(".home-nav");
const about_nav = document.querySelector(".about-nav");

login_nav.onclick = () => {
    auth_cont.style.display = "flex";
    p.style.display = "none";
    about_cont.style.display = "none";
};
home_nav.onclick = () => {
    auth_cont.style.display = "none";
    p.style.display = "block";
    about_cont.style.display = "none";
};
about_nav.onclick = () => {
    auth_cont.style.display = "none";
    p.style.display = "none";
    about_cont.style.display = "block";
};
