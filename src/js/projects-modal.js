import {Fancybox} from "@fancyapps/ui";

export default function projectsModal() {
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
}
