import Packery from 'packery/js/packery';
import imagesLoaded from 'imagesloaded';

export default function projectsGrid() {
    // Grid packery
    let pckry;

    const initGrid = function () {
        const container = document.querySelector('.projects-grid');
        const grid = document.querySelector('.projects-grid__items');

        if (!container || !grid) {
            return;
        }

        pckry = new Packery(grid, {
            itemSelector: '.projects-grid__item',
            gutter: 0,
            transitionDuration: 0,
            percentPosition: true
        });

        $(container).addClass('projects-grid_loaded');

        imagesLoaded(grid).on('progress', () => {
            pckry.layout();
        });
        // imagesLoaded(grid, () => {
        //     pckry.layout();
        // });
    }

    initGrid();

    document.addEventListener('update-catalog', initGrid);
    document.addEventListener('sidebar:collapse:end', () => {
        pckry && pckry.layout();
    });
}
