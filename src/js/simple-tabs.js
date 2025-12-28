import Swiper from 'swiper/bundle';

export default function simpleTabs() {
    // Создаём глобальный тултип один раз
    let globalTooltip = document.querySelector('.simple-tab-tooltip-global');
    if (!globalTooltip) {
        globalTooltip = document.createElement('div');
        globalTooltip.className = 'simple-tab-tooltip-global';
        globalTooltip.innerHTML = `
            <div class="simple-tab-tooltip-global__body"></div>
            <div class="simple-tab-tooltip-global__arrow"></div>
        `;
        document.body.appendChild(globalTooltip);
    }

    const tooltipBody = globalTooltip.querySelector('.simple-tab-tooltip-global__body');

    // Функция проверки видимости элемента
    function isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        const containerRect = element.closest('.simple-tab-buttons-swiper').getBoundingClientRect();
        
        // Проверяем, что элемент ПОЛНОСТЬЮ виден в контейнере
        return (
            rect.left >= containerRect.left &&
            rect.right <= containerRect.right &&
            rect.top >= containerRect.top &&
            rect.bottom <= containerRect.bottom
        );
    }

    // Функция позиционирования тултипа
    function positionTooltip(button) {
        const rect = button.getBoundingClientRect();
        const tooltipRect = globalTooltip.getBoundingClientRect();
        const padding = 10; // Отступ от краёв экрана
        
        // Вычисляем начальную позицию (центрируем над кнопкой)
        let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        let top = rect.top - tooltipRect.height - 10;
        
        // Проверяем левый край экрана
        if (left < padding) {
            left = padding;
        }
        
        // Проверяем правый край экрана
        if (left + tooltipRect.width > window.innerWidth - padding) {
            left = window.innerWidth - tooltipRect.width - padding;
        }
        
        // Проверяем верхний край экрана (если не помещается сверху, показываем снизу)
        if (top < padding) {
            // Показываем снизу от кнопки
            top = rect.bottom + 10;
            globalTooltip.classList.add('below');
        } else {
            globalTooltip.classList.remove('below');
        }
        
        globalTooltip.style.left = `${left}px`;
        globalTooltip.style.top = `${top}px`;
    }

    // Функция показа тултипа
    function showTooltip(button, text) {
        // Проверяем видимость кнопки
        if (!isElementVisible(button)) {
            return; // Не показываем тултип для невидимых элементов
        }
        
        tooltipBody.textContent = text;
        globalTooltip.classList.add('visible');
        // Позиционируем после обновления текста (чтобы знать финальную ширину)
        requestAnimationFrame(() => {
            positionTooltip(button);
        });
    }

    // Функция скрытия тултипа
    function hideTooltip() {
        globalTooltip.classList.remove('visible');
    }
    // Инициализация Swiper для кнопок табов
    document.querySelectorAll('.simple-tab-buttons-swiper').forEach((swiperEl) => {
        const container = swiperEl.closest('.simple-tab-group');
        const wrapper = swiperEl.parentElement;
        const prevButton = wrapper?.querySelector('.simple-tab-swiper-button-prev');
        const nextButton = wrapper?.querySelector('.simple-tab-swiper-button-next');

        // Функция проверки необходимости центрирования
        const shouldCenter = () => {
            const containerWidth = swiperEl.offsetWidth;
            const wrapperWidth = swiperEl.querySelector('.swiper-wrapper')?.scrollWidth || 0;
            return wrapperWidth > containerWidth;
        };

        // Определяем настройки центрирования
        const needsCentering = shouldCenter();

        let swiper = new Swiper(swiperEl, {
            slidesPerView: 'auto',
            slideToClickedSlide: needsCentering,
            spaceBetween: 20,
            centeredSlides: needsCentering,
            centeredSlidesBounds: needsCentering,
            centerInsufficientSlides: needsCentering,
            freeMode: true,
            mousewheel: {
                forceToAxis: true,
            },
            navigation: {
                prevEl: prevButton,
                nextEl: nextButton,
            },
            touchEventsTarget: 'container',
            touchStartPreventDefault: false,
            preventClicks: false,
            preventClicksPropagation: false,
            allowTouchMove: true,
            on: {
                resize: function() {
                    // Пересчитываем при изменении размера окна
                    const needsCenter = shouldCenter();
                    this.params.centeredSlides = needsCenter;
                    this.params.centeredSlidesBounds = needsCenter;
                    this.params.centerInsufficientSlides = needsCenter;
                    this.params.slideToClickedSlide = needsCenter;
                    this.update();
                },
                touchStart: function() {
                    // Скрываем тултип при начале прокрутки
                    hideTooltip();
                },
                slideChangeTransitionStart: function() {
                    // Скрываем тултип при смене слайда
                    hideTooltip();
                }
            }
        });

        setTimeout(() => swiper.update(), 500);

        // Добавляем обработчики для показа тултипов
        setTimeout(() => {
            const buttons = swiperEl.querySelectorAll('.simple-tab-btn');
            buttons.forEach((btn) => {
                // Оборачиваем текст в span для overflow, если ещё не обёрнут
                if (!btn.querySelector('.simple-tab-btn-text')) {
                    const tooltipText = btn.textContent.trim();
                    const textSpan = document.createElement('span');
                    textSpan.className = 'simple-tab-btn-text';
                    textSpan.textContent = tooltipText;
                    btn.textContent = '';
                    btn.appendChild(textSpan);
                }

                const textSpan = btn.querySelector('.simple-tab-btn-text');
                const fullText = textSpan.textContent;

                // Обработчики для показа/скрытия тултипа
                btn.addEventListener('mouseenter', () => {
                    // Проверяем, обрезан ли текст
                    const isTextTruncated = textSpan.scrollWidth > textSpan.clientWidth;
                    
                    // Показываем тултип только если текст обрезан
                    if (isTextTruncated) {
                        showTooltip(btn, fullText);
                    }
                });

                btn.addEventListener('mouseleave', () => {
                    hideTooltip();
                });
            });
        }, 600);
    });

    document.querySelectorAll('.simple-tab-group').forEach((groupEl) => {
        // Поддержка как старой структуры, так и новой (с Swiper)
        let buttons = groupEl.querySelectorAll('.simple-tab-buttons .simple-tab-btn');

        // Если кнопки внутри Swiper
        if (buttons.length === 0) {
            buttons = groupEl.querySelectorAll('.simple-tab-buttons-swiper .simple-tab-btn');
        }

        const panels = groupEl.querySelectorAll(':scope > .simple-tab-content');

        if (buttons.length === 0 || panels.length === 0) {
            return;
        }

        buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                // Убираем активный класс со всех кнопок
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Скрываем все панели и показываем нужную
                panels.forEach((panel, panelIndex) => {
                    if (panelIndex === index) {
                        panel.classList.remove('hidden');
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                        panel.classList.add('hidden');
                    }
                });
            });
        });

        // Инициализация: показываем первую панель, остальные скрываем
        panels.forEach((panel, index) => {
            if (index === 0) {
                panel.classList.remove('hidden');
                panel.classList.add('active');
            } else {
                panel.classList.add('hidden');
                panel.classList.remove('active');
            }
        });
    });
}
