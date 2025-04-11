import tabs from "./tabs.js";
import sidebar from "./sidebar.js";
import filters from "./filters.js";
import projects from "./projects.js";
// import $ from 'jquery';

tabs();
sidebar();
filters();
projects();

document.addEventListener('fancybox:contentReady', (e) => {
    tabs();
});

function togglePassword() {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
}

window.togglePassword = togglePassword;
