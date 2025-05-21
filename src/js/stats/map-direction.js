/**
 * Инициализирует фильтр по направлениям и возвращает объект с методами управления
 *
 * @param {Object} options - Параметры инициализации
 * @param {string|HTMLElement} options.container - Селектор или DOM-элемент контейнера фильтра
 * @param {Array} options.directions - Массив направлений
 * @param {Function} options.onChange - Функция-колбэк при изменении выбранного направления
 * @returns {Object} - Объект с методами управления фильтром
 */
export default function initDirectionFilter(options) {
    const { container, directions = [], onChange } = options;

    // Получаем DOM-элементы
    const filterContainer = typeof container === 'string'
        ? document.querySelector(container)
        : container;

    if (!filterContainer) {
        console.error('Не найден контейнер для фильтра направлений');
        return null;
    }

    const filterItems = filterContainer.querySelectorAll('.filter__item');

    // Текущее состояние
    let currentDirectionId = null;

    // Инициализируем обработчики событий для фильтра
    filterItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Не обрабатываем клик по disabled элементам
            if (this.hasAttribute('disabled')) {
                return;
            }

            // Удаляем активный класс у всех фильтров
            filterItems.forEach(el => el.classList.remove('filter__item_active'));

            // Добавляем активный класс текущему фильтру
            this.classList.add('filter__item_active');

            // Получаем ID направления
            const directionId = this.dataset.directionId === "null" || !this.dataset.directionId
                ? null
                : parseInt(this.dataset.directionId, 10);

            // Обновляем текущее направление
            currentDirectionId = directionId;

            // Вызываем колбэк
            if (typeof onChange === 'function') {
                onChange(directionId);
            }
        });
    });

    // Метод для программного изменения выбранного направления
    function setDirection(directionId) {
        const directionItem = Array.from(filterItems).find(item => {
            const itemDirectionId = item.dataset.directionId === "null" || !item.dataset.directionId
                ? null
                : parseInt(item.dataset.directionId, 10);
            return itemDirectionId === directionId;
        });

        if (directionItem && !directionItem.hasAttribute('disabled')) {
            // Симулируем клик по элементу
            directionItem.click();
        }
    }

    /**
     * Устанавливает disabled-состояние для направлений
     * @param {Array} availableDirectionIds - Массив доступных ID направлений
     */
    function setAvailableDirections(availableDirectionIds) {
        // Получаем элемент "Все"
        const allDirectionsItem = Array.from(filterItems).find(item => {
            return item.dataset.directionId === "null" || !item.dataset.directionId;
        });

        // Обрабатываем каждый элемент фильтра
        filterItems.forEach(item => {
            const directionId = item.dataset.directionId === "null" || !item.dataset.directionId
                ? null
                : parseInt(item.dataset.directionId, 10);

            // Элемент "Все" всегда доступен
            if (directionId === null) {
                item.removeAttribute('disabled');
                return;
            }

            // Проверяем, доступно ли направление
            const isAvailable = availableDirectionIds.includes(directionId);

            if (isAvailable) {
                item.removeAttribute('disabled');
            } else {
                item.setAttribute('disabled', 'disabled');

                // Если текущий активный элемент стал disabled, выбираем "Все"
                // Такое пока не нужно, потому что при смене города фильтр сбрасывается, но возможно пригодится при переходе на SPA.
                // if (item.classList.contains('filter__item_active') && allDirectionsItem) {
                //     currentDirectionId = null;

                //     // Удаляем активный класс у всех фильтров
                //     filterItems.forEach(el => el.classList.remove('filter__item_active'));

                //     // Активируем элемент "Все"
                //     allDirectionsItem.classList.add('filter__item_active');

                //     // Вызываем колбэк
                //     if (typeof onChange === 'function') {
                //         onChange(null);
                //     }
                // }
            }
        });
    }

    // Возвращаем API объекта
    return {
        getCurrentDirectionId: () => currentDirectionId,
        setDirection,
        setAvailableDirections,
    };
}
