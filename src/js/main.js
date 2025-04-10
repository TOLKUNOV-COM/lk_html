import tabs from "./tabs.js";
import sidebar from "./sidebar.js";
// import $ from 'jquery';

tabs();
sidebar();

function togglePassword() {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
}

window.togglePassword = togglePassword;
