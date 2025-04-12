import {Fancybox} from "@fancyapps/ui";
import Packery from 'packery/js/packery';
import imagesLoaded from 'imagesloaded';

export default function projects() {
    $(document).on('click', '.projects__item', function (e) {
        // Проверка, не был ли клик по кнопке внутри строки
        if (e.target.closest('button, a[target="_blank"], .links-popup')) return;

        e.preventDefault();
        let src = $(this).data('src');

        // Запускаем Fancybox
        Fancybox.show([{
            src: src,
            // Тип контента
            type: 'ajax',
        }], {
            autoFocus: false,
            dragToClose: false,
            on: {
                done: (fancybox, slide) => {
                    const event = new CustomEvent('fancybox:contentReady', {
                        detail: {
                            content: slide.$content, // DOM-элемент, который подгрузился
                            slide,
                            fancybox
                        }
                    });

                    document.dispatchEvent(event);
                }
            },
        });
    });

    $(document).on('click', '.projects-list__link', function (e) {
        e.preventDefault();
    });

    // Grid packery
    let pckry;

    const initGrid = function () {
        const container = document.querySelector('.projects-grid');
        const grid = document.querySelector('.projects-grid__items');

        pckry = new Packery(grid, {
            itemSelector: '.projects-grid__item',
            gutter: 0,
            // fitWidth: false,
            // stagger: 0,
            transitionDuration: 0,

            // columnWidth: '.materials-item__width',
            // gutter: '.materials-item__gutter',
            // fitWidth: true,
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
        pckry.layout();
    });
}
