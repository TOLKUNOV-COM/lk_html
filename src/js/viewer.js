export default function viewer() {
    const viewerElements = document.querySelectorAll('.viewer');

    viewerElements.forEach(initializeViewer);

    function initializeViewer(viewerElement) {
        const swiper = viewerElement.querySelector('.tab-swiper');
        if (!swiper) return;

        const swiperInstance = swiper.swiper;
        if (!swiperInstance) return;

        // Обработка начала скролла
        swiperInstance.on('slideChangeTransitionStart', () => {
            const nextSlide = swiperInstance.slides[swiperInstance.activeIndex];
            initializeSlideContent(nextSlide);
        });

        // Обработка окончания скролла
        swiperInstance.on('slideChangeTransitionEnd', () => {
            // Деинициализация неактивных слайдов
            swiperInstance.slides.forEach((slide, index) => {
                if (index !== swiperInstance.activeIndex) {
                    deinitializeSlideContent(slide);
                }
            });
        });

        // Инициализация первого слайда при загрузке страницы
        const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
        if (activeSlide) {
            initializeSlideContent(activeSlide);
        }
    }

    function initializeSlideContent(slide) {
        deinitializeSlideContent(slide);

        // Инициализация изображений
        slide.querySelectorAll('.js-image').forEach(placeholder => {
            if (placeholder.dataset.initialized === 'true') return;

            const img = document.createElement('img');
            img.src = placeholder.dataset.src || '';
            img.alt = placeholder.dataset.alt || '';
            img.width = placeholder.dataset.width || '';
            img.height = placeholder.dataset.height || '';
            img.className = placeholder.dataset.class || 'viewer__image';

            // Устанавливаем флаг только после загрузки изображения
            placeholder.dataset.initialized = 'false';
            img.onload = () => {
                placeholder.dataset.initialized = 'true';
            };

            placeholder.appendChild(img);
        });

        // Инициализация видео
        slide.querySelectorAll('.js-video').forEach(placeholder => {
            if (placeholder.dataset.initialized === 'true') return;

            const video = document.createElement('video');
            video.className = placeholder.dataset.class || 'viewer__video';
            video.muted = placeholder.dataset.muted !== 'false';
            video.controls = placeholder.dataset.controls !== 'false';
            video.loop = placeholder.dataset.loop !== 'false';
            video.playsInline = placeholder.dataset.playsinline !== 'false';
            video.preload = 'auto';

            const source = document.createElement('source');
            source.src = placeholder.dataset.src || '';
            // source.type = placeholder.dataset.type || 'video/mp4';

            // Устанавливаем флаг только когда видео готово к воспроизведению
            placeholder.dataset.initialized = 'false';
            video.addEventListener('canplay', () => {
                placeholder.dataset.initialized = 'true';
                video.play();
            });

            video.appendChild(source);
            placeholder.appendChild(video);
        });

        // Инициализация iframe
        slide.querySelectorAll('.js-iframe').forEach(placeholder => {
            if (placeholder.dataset.initialized === 'true') return;

            const iframe = document.createElement('iframe');
            iframe.src = placeholder.dataset.src || '';
            iframe.width = placeholder.dataset.width || '';
            iframe.height = placeholder.dataset.height || '';
            iframe.className = placeholder.dataset.class || 'viewer__iframe';
            iframe.frameBorder = placeholder.dataset.frameborder || '0';
            iframe.scrolling = placeholder.dataset.scrolling || 'no';

            // Устанавливаем флаг после загрузки iframe
            placeholder.dataset.initialized = 'false';
            iframe.onload = () => {
                placeholder.dataset.initialized = 'true';
            };

            placeholder.appendChild(iframe);
        });
    }

    function deinitializeSlideContent(slide) {
        // Очистка инициализированного контента
        const initialized = slide.querySelectorAll('[data-initialized]');
        initialized.forEach(element => {
            // Сохраняем плейсхолдер, удаляем созданные элементы
            element.dataset.initialized = 'false';
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        });
    }
}
