$(document).on('click', '.js-toggle-favorite', function (e) {
    e.preventDefault();

    $(this).toggleClass('js-toggle-favorite_active');
});
