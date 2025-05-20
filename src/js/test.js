$(document).on('click', '.js-toggle-favorite', function (e) {
    e.preventDefault();

    $(this).toggleClass('js-toggle-favorite_active');
});

$(document).on('click', '#project-filter-form .filter__item:not(.filter__item_expand):not(.filter__item_collapse)', function (e) {
    e.preventDefault();

    $(this).toggleClass('filter__item_active');
});

$(document).on('click', '.filters__reset', function (e) {
    e.preventDefault();

    $('.filter__item').removeClass('filter__item_active');
});

// Прячем кнопку закрытия из view при модальной загрузке
document.addEventListener('fancybox:contentReady', (e) => {
    $('.fancybox__content a[href="projects_grid.html"]').hide();
});
