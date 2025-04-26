import tabs from "./tabs.js";
import sidebar from "./sidebar.js";
import filters from "./filters.js";
import projectsModal from "./projects-modal.js";
import projectsGrid from "./projects-grid.js";
import shareButton from "./share-button.js";
import linksPopup from "./links-popup.js";
import favoriteButton from "./favorite-button.js";
// import $ from 'jquery';

tabs();
sidebar();
filters();
projectsModal();
projectsGrid();
shareButton();
linksPopup();
favoriteButton();

document.addEventListener('fancybox:contentReady', (e) => {
    tabs();
});

function togglePassword() {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
}

window.togglePassword = togglePassword;
