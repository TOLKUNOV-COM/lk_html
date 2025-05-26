import placemarkImage from '../../img/placemark.webp';
import initPlatformFilter from './map-platform.js';
import initDirectionFilter from './map-direction.js';

/**
 * Инициализирует все карты на странице
 */
export default function initMap() {
    document.querySelectorAll('[data-module="map"]').forEach((el) => {
        try {
            const points = JSON.parse(el.dataset.points || '[]');
            const directions = JSON.parse(el.dataset.directions || '[]');
            const platforms = JSON.parse(el.dataset.platforms || '[]');
            createMap(el, points, directions, platforms);
        } catch (error) {
            console.error('Ошибка при парсинге данных карты:', error);
        }
    });
}

/**
 * Инициализирует и отображает карту Яндекс с заданными точками.
 * Точки отображаются с указанными значениями, автоматически масштабируется
 * для отображения всех точек.
 *
 * @param {HTMLElement|string} container - DOM-элемент или id элемента для карты
 * @param {Array} points - Массив точек [{lat, lon, name, value, direction_id, platform_id}]
 * @param {Array} directions - Массив направлений [{id, name}]
 * @param {Array} platforms - Массив платформ [{id, name}]
 */
function createMap(container, points = [], directions = [], platforms = []) {
    // Получаем DOM-элемент
    const chartDom = typeof container === 'string'
        ? document.getElementById(container)
        : container;

    if (!chartDom || points.length === 0) {
        return;
    }

    // Находим контейнеры фильтров
    const directionFilterContainer = chartDom.closest('.card').querySelector('#mapDirectionFilter');
    const platformFilterContainer = chartDom.closest('.card').querySelector('#mapPlatformFilter');

    // Текущие отфильтрованные точки и фильтры
    let filteredPoints = [...points];
    let currentDirectionId = null;
    let currentPlatformId = null;
    let map, clusterer, geoObjects = [];
    let directionFilter = null;
    let platformFilter = null;

    // Элементы балуна
    const mapBalloon = chartDom.closest('.map-container').querySelector('#mapBalloon');
    const balloonTitle = mapBalloon?.querySelector('#balloonTitle');
    const monthlyDataContainer = mapBalloon?.querySelector('#monthlyData');
    const closeBalloonButton = mapBalloon?.querySelector('#closeBalloon');

    // Обработчик закрытия балуна
    if (closeBalloonButton && mapBalloon) {
        closeBalloonButton.addEventListener('click', () => {
            hideBalloon();
        });
    }

    // Загружаем API Яндекс Карт, если не загружен
    loadYandexMapsApi().then(() => {
        ymaps.ready(() => {
            try {
                // Создаем карту
                map = new ymaps.Map(chartDom.id, {
                    center: [55.76, 37.64], // Временный центр
                    zoom: 5,
                    controls: ['zoomControl', /* 'geolocationControl', */ 'typeSelector', 'fullscreenControl']
                });

                // Отключаем scroll zoom по умолчанию
                map.behaviors.disable('scrollZoom');

                const container = document.querySelector('.map-container');

                let isScrollEnabled = false;

                container.addEventListener('click', () => {
                    if (!isScrollEnabled) {
                        map.behaviors.enable('scrollZoom');
                        isScrollEnabled = true;
                    }
                });

                container.addEventListener('mouseleave', () => {
                    if (isScrollEnabled) {
                        map.behaviors.disable('scrollZoom');
                        isScrollEnabled = false;
                    }
                });

                // Закрываем балун при клике на карту
                map.events.add('click', (e) => {
                    // Проверяем, что клик был именно на карте, а не на объекте
                    const target = e.get('target');
                    if (target === map && mapBalloon) {
                        hideBalloon();
                    }
                });

                // Создаем кластеризатор
                clusterer = new ymaps.Clusterer({
                    preset: 'islands#blueClusterIcons',
                    groupByCoordinates: false,
                    clusterDisableClickZoom: false,
                    clusterHideIconOnBalloonOpen: false,
                    geoObjectHideIconOnBalloonOpen: false,
                    // Шаблон для балуна кластера
                    clusterBalloonContentLayout: ymaps.templateLayoutFactory.createClass(
                        '<div class="cluster-balloon" style="padding: 10px; max-height: 300px; overflow-y: auto;">' +
                        '<h3 style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">Точки в кластере: $[properties.geoObjects.length]</h3>' +
                        '<ul style="list-style: none; margin: 0; padding: 0;">' +
                        '{% for geoObject in properties.geoObjects %}' +
                        '<li style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #eee;">' +
                        '<div style="font-weight: bold; margin-bottom: 5px;">{{ geoObject.properties.balloonContent|raw }}</div>' +
                        '</li>' +
                        '{% endfor %}' +
                        '</ul>' +
                        '</div>'
                    ),
                    clusterBalloonPanelMaxMapArea: 0,
                });

                // Инициализация фильтра по платформам
                if (platformFilterContainer) {
                    platformFilter = initPlatformFilter({
                        container: platformFilterContainer,
                        platforms: platforms,
                        onChange: (platformId) => {
                            currentPlatformId = platformId;

                            // Получаем доступные направления для выбранного города
                            const availableDirectionIds = getAvailableDirectionsForPlatform(platformId);

                            // Устанавливаем enabled-состояние для доступных направлений
                            if (directionFilter) {
                                directionFilter.setAvailableDirections(availableDirectionIds);
                            }

                            // Проверяем, есть ли точки с текущим направлением в выбранном городе
                            if (currentDirectionId !== null) {
                                const hasPointsWithCurrentDirection = points.some(point =>
                                    point.platform_id === platformId &&
                                    point.direction_id === currentDirectionId
                                );

                                // Если точек с текущим направлением нет, сбрасываем фильтр направлений
                                if (!hasPointsWithCurrentDirection && directionFilter) {
                                    directionFilter.setDirection(null);
                                } else {
                                    // Иначе обновляем точки с текущими фильтрами
                                    updateMapPoints();
                                }
                            } else {
                                // Если направление не выбрано, просто обновляем точки
                                updateMapPoints();
                            }
                        }
                    });

                    // Автоматически выбираем первый город при инициализации
                    if (platforms.length > 0) {
                        platformFilter.setPlatform(platforms[0].id);
                    } else {
                        // Инициализация маркеров
                        updateMapPoints();
                    }
                } else {
                    // Инициализация маркеров
                    updateMapPoints();
                }

                // Инициализация фильтра по направлениям
                if (directionFilterContainer) {
                    directionFilter = initDirectionFilter({
                        container: directionFilterContainer,
                        directions: directions,
                        onChange: (directionId) => {
                            currentDirectionId = directionId;
                            updateMapPoints();
                        }
                    });
                }

            } catch (error) {
                console.error('Ошибка инициализации карты:', error);
            }
        });
    });

    /**
     * Возвращает массив доступных ID направлений для выбранной платформы
     * @param {number|null} platformId - ID платформы
     * @returns {Array} - Массив доступных ID направлений
     */
    function getAvailableDirectionsForPlatform(platformId) {
        // Если платформа не выбрана, возвращаем все направления
        if (platformId === null) {
            return directions.filter(d => d.id !== null && d.id !== undefined).map(d => d.id);
        }

        // Получаем уникальные ID направлений для выбранной платформы
        const directionIds = new Set();

        points.forEach(point => {
            if (point.platform_id === platformId) {
                // Проверяем, является ли direction_id массивом
                if (Array.isArray(point.direction_id)) {
                    // Добавляем каждый ID из массива
                    point.direction_id.forEach(dirId => {
                        if (dirId !== null) {
                            directionIds.add(dirId);
                        }
                    });
                } else if (point.direction_id !== null) {
                    // Если direction_id не массив, добавляем его как обычно
                    directionIds.add(point.direction_id);
                }
            }
        });

        return Array.from(directionIds);
    }

    /**
     * Показывает балун с данными о размещениях по месяцам
     * @param {Object} point - Данные точки
     */
    function showBalloon(point) {
        if (!mapBalloon || !balloonTitle || !monthlyDataContainer) return;

        // Устанавливаем заголовок с обработкой вертикальной черты
        const titleWithBreaks = point.name.replace(/ \| /g, '<br>');
        balloonTitle.innerHTML = titleWithBreaks;

        // Получаем максимальное значение для расчета ширины полосок
        const maxCount = Math.max(...(point.placements || []).map(item => item.count));

        // Генерируем HTML для месячных данных
        const monthlyHTML = (point.placements || []).map(item => {
            let widthPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

            return `
                <div>${item.label}</div>
                <div class="h-full rounded-lg border border-map-bar/4 bg-map-bar/10 snap-start" style="width: ${widthPercent.toFixed(2)}%;"></div>
                <div class="text-blue-900">${item.count}</div>
            `;
        }).join('');

        monthlyDataContainer.innerHTML = monthlyHTML;

        // Показываем балун с анимацией
        mapBalloon.dataset.state = 'visible';
        mapBalloon.classList.remove('opacity-0', '-translate-x-8', 'scale-95', 'pointer-events-none');
        mapBalloon.classList.add('opacity-100', 'translate-x-0', 'scale-100', 'pointer-events-auto');
    }

    /**
     * Скрывает балун с анимацией
     */
    function hideBalloon() {
        if (!mapBalloon) return;

        mapBalloon.dataset.state = 'hidden';
        mapBalloon.classList.remove('opacity-100', 'translate-x-0', 'scale-100', 'pointer-events-auto');
        mapBalloon.classList.add('opacity-0', '-translate-x-8', 'scale-95', 'pointer-events-none');
    }

    /**
     * Обновляет точки на карте с учетом текущих фильтров
     */
    function updateMapPoints() {
        if (!map || !clusterer) return;

        // Фильтруем точки по направлению и платформе
        filteredPoints = points.filter(point => {
            // Проверка по платформе
            const matchesPlatform = currentPlatformId === null || point.platform_id === currentPlatformId;

            // Проверка по направлению
            let matchesDirection = false;

            if (currentDirectionId === null) {
                // Если направление не выбрано, показываем все точки
                matchesDirection = true;
            } else if (Array.isArray(point.direction_id)) {
                // Если direction_id - массив, проверяем наличие currentDirectionId в этом массиве
                matchesDirection = point.direction_id.includes(currentDirectionId);
            } else {
                // Если direction_id - одиночное значение, сравниваем как раньше
                matchesDirection = point.direction_id === currentDirectionId;
            }

            // Точка должна соответствовать обоим фильтрам
            return matchesDirection && matchesPlatform;
        });

        // Очищаем карту
        clusterer.removeAll();

        // Создаем гео-объекты для каждой точки
        geoObjects = filteredPoints.map(point => {
            // Получаем имена направлений
            // let directionNames = '';
            // if (Array.isArray(point.direction_id)) {
            //     // Если direction_id - массив, получаем имена всех направлений
            //     directionNames = point.direction_id.map(dirId => {
            //         const dir = directions.find(d => d.id === dirId);
            //         return dir ? dir.name : '';
            //     }).filter(Boolean).join(', ');
            // } else {
            //     // Если direction_id - одиночное значение
            //     const dir = directions.find(d => d.id === point.direction_id);
            //     directionNames = dir ? dir.name : '';
            // }

            const platformName = platforms.find(p => p.id === point.platform_id)?.name || '';

            const placemark = new ymaps.Placemark([point.lat, point.lon], {
                // Полное содержимое для баллона кластера
                // balloonContent: `<strong>${point.name}</strong><br>Количество: ${point.value}<br>Направление: ${directionNames}<br>Город: ${platformName}`,
                // Добавляем дополнительные свойства для использования в шаблонах кластеров и балуна
                clusterCaption: point.name,
                value: point.value,
                iconContent: point.value,
                // Для кастомного балуна
                // pointName: point.name,
                // pointValue: point.value,
                // directionNames: directionNames,
                // platformName: platformName,
                // Настраиваем внешний вид при наведении и нажатии
                hintContent: point.name
            }, {
                // Создаем круглую метку с числом внутри
                iconLayout: 'default#imageWithContent',
                iconImageHref: placemarkImage,
                iconImageSize: [60, 60],
                iconImageOffset: [-30, -52],
                iconContentOffset: [30, -2],
                iconContentLayout: ymaps.templateLayoutFactory.createClass(`
    <div class="size-5 rounded-full flex items-center justify-center bg-white inset-ring inset-ring-[#F1F1EC] font-sans text-blue-900 font-black text-[0.5rem] leading-2.5">
        $[properties.iconContent]
    </div>
`),
                // Отключаем стандартный балун
                balloonPanelMaxMapArea: 0,
                hideIconOnBalloonOpen: false
            });

            // Добавляем обработчики событий для метки
            // placemark.events
            //     .add('mouseenter', function () {
            //         // Можно изменить размер метки при наведении
            //         placemark.options.set('iconImageSize', [48, 48]);
            //         placemark.options.set('iconImageOffset', [-24, -24]);
            //     })
            //     .add('mouseleave', function () {
            //         // Возвращаем оригинальный размер
            //         placemark.options.set('iconImageSize', [44, 44]);
            //         placemark.options.set('iconImageOffset', [-22, -22]);
            //     });

            // Добавляем обработчик клика для показа балуна
            placemark.events.add('click', function () {
                showBalloon(point);
            });

            return placemark;
        });

        // Добавляем метки в кластеризатор
        clusterer.add(geoObjects);
        map.geoObjects.add(clusterer);

        // Центрируем карту
        updateMapSize();

        // Обработчики событий
        window.addEventListener('resize', updateMapSize);
        document.addEventListener('sidebar:collapse:end', updateMapSize);

        // Добавляем кнопку для центрирования карты
        const centerButton = new ymaps.control.Button({
            data: {
                image: 'data:image/svg+xml;utf8,<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14Z" fill="%232856F6"/><circle cx="8" cy="8" r="4" fill="%232856F6"/></svg>',
                title: 'Показать все точки'
            }
        }, { float: 'right' });

        // centerButton.events.add('click', centerMapByPoints);
        // map.controls.add(centerButton);
    }

    /**
     * Возвращает цвет метки в зависимости от direction_id
     * @param {number} directionId - ID направления
     * @returns {string} - Цвет в формате hex
     */
    function getColorByDirectionId(directionId) {
        switch (directionId) {
            case 2: // DOOH
                return '#2856F6';
            case 3: // OOH
                return '#28AF51';
            case 4: // Медиафасады
                return '#FFA500';
            default:
                return '#2856F6';
        }
    }

    /**
     * Центрирует карту по текущим точкам
     */
    function centerMapByPoints() {
        if (!map || !clusterer || geoObjects.length === 0) return;

        // Получаем границы кластеризатора
        var bounds = clusterer.getBounds();

        if (bounds) {
            map.setBounds(bounds, {
                checkZoomRange: true,
                zoomMargin: 60,
                // Добавляем плавную анимацию
                duration: 300
            });
        }
    }

    // Функция для обновления размера карты
    const updateMapSize = () => {
        map.container.fitToViewport();
        // После подгонки размера, пересчитываем центр и масштаб
        centerMapByPoints();
    };
}

/**
 * Загружает API Яндекс Карт, если он еще не был загружен
 * @returns {Promise} Promise, который разрешается, когда API загружен
 */
function loadYandexMapsApi() {
    return new Promise((resolve) => {
        if (window.ymaps) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?apikey=ваш_API_ключ&lang=ru_RU';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}
