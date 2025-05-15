import tabs from "./tabs.js";
import sidebar from "./sidebar.js";
import filters from "./filters.js";
import projectsModal from "./projects-modal.js";
import projectsGrid from "./projects-grid.js";
import shareButton from "./share-button.js";
import linksPopup from "./links-popup.js";
import favoriteButton from "./favorite-button.js";
import viewer from "./viewer.js";
import { lineCharts, pieCharts, barCharts } from "./charts/index.js";
import initAllTouchScroll from "./touchScroll.js";

tabs();
sidebar();
filters();
projectsModal();
projectsGrid();
shareButton();
linksPopup();
favoriteButton();
viewer();
lineCharts();
pieCharts();
barCharts();
initAllTouchScroll();

// when fancybox content open
document.addEventListener('fancybox:contentReady', (e) => {
    tabs();
    viewer();
    initAllTouchScroll();
});

function togglePassword() {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
}

window.togglePassword = togglePassword;
window.projectsGrid = projectsGrid;
