export default function linksPopup() {
    $(document).on('click', '.js-toggle-links-popup', function (e) {
        e.preventDefault();

        $(this).next('.links-popup').toggleClass('links-popup_open');
    });
}
