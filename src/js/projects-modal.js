import {Fancybox} from "@fancyapps/ui";

export default function projectsModal() {
    // Флаг для отслеживания текущего состояния Fancybox
    let isFancyboxOpen = false;

    // Функция для открытия модального окна
    function openProjectModal(src, pushState = true) {
        // Переменная для хранения исходного URL
        let originalUrl = document.location.href;

        // Изменяем URL только если нужно добавить в историю
        if (pushState) {
            // Сохраняем текущий URL перед изменением
            // window.history.replaceState({ modal: false }, '', window.location.href);
            // Добавляем новый URL с флагом модального окна

            console.log('PUSH', { modal: true }, src);

            window.history.pushState({ modal: true }, '', src);
        }

        isFancyboxOpen = true;

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
                },
                closing: (fancybox) => {
                    if (!fancybox.userData?.skipHistory) {
                        // if (window.history.state && window.history.state.modal === true) {
                        console.log('PUSH BACK');
                        window.history.back(); // Используем back() вместо pushState
                        // }

                        // Восстанавливаем исходный URL при закрытии
                        // window.history.pushState({}, '', originalUrl);
                    }

                    setTimeout(() => {
                        isFancyboxOpen = false
                    }, 1);
                }
            },
        });
    }

    // Обработчик событий навигации браузера (кнопки назад/вперёд)
    window.addEventListener('popstate', function (event) {
        console.log('POP', event.state, location.href);

        const currentUrl = window.location.href;

        // Получаем состояние из истории, если оно есть
        const state = event.state || {};

        // Если в состоянии есть флаг modal и он true - открываем модалку
        if (state.modal === true && !isFancyboxOpen) {
            openProjectModal(currentUrl, false);
        }
        // Если в состоянии флаг modal === false или его нет, и модалка открыта - закрываем
        else if (isFancyboxOpen && (!state.modal || state.modal === false)) {
            const instance = Fancybox.getInstance();

            if (instance) {
                instance.userData = { skipHistory: true };
                instance.close();
            }
        } else if (!isFancyboxOpen && (!state.modal || state.modal === false)) {
            location.reload();
        }
    });

    $(document).on('click', '.projects__item', function (e) {
        // Проверка, не был ли клик по кнопке внутри строки
        if (e.target.closest('button, a[target="_blank"], .links-popup')) return;

        e.preventDefault();
        let src = $(this).data('src');

        openProjectModal(src);
    });

    $(document).on('click', '.projects-list__link', function (e) {
        e.preventDefault();
    });
}
