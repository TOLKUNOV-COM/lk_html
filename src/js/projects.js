import {Fancybox} from "@fancyapps/ui";

export default function projects() {
    Fancybox.bind('.projects__item', {
        // Тип контента
        type: 'ajax',
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
}
