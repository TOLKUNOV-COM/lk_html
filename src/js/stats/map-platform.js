/**
 * Инициализирует фильтр по платформам (городам) и возвращает объект с методами управления
 * 
 * @param {Object} options - Параметры инициализации
 * @param {string|HTMLElement} options.container - Селектор или DOM-элемент контейнера фильтра
 * @param {Array} options.platforms - Массив платформ
 * @param {Function} options.onChange - Функция-колбэк при изменении выбранной платформы
 * @returns {Object} - Объект с методами управления фильтром
 */
export default function initPlatformFilter(options) {
    const { container, platforms = [], onChange } = options;
    
    // Получаем DOM-элементы
    const filterEl = typeof container === 'string'
        ? document.querySelector(container)
        : container;
    
    if (!filterEl) {
        console.error('Не найден контейнер для фильтра платформ');
        return null;
    }
    
    const dropdownEl = filterEl.querySelector('.map__platform-dropdown');
    const currentEl = filterEl.querySelector('.map__platform-current');
    const listItems = filterEl.querySelectorAll('.map__platform-item');
    
    // Текущее состояние
    let currentPlatformId = null;
    let isOpen = false;
    
    // Инициализируем обработчики событий
    
    // 1. Открытие/закрытие выпадающего списка
    currentEl.addEventListener('click', function(e) {
        e.preventDefault();
        toggleDropdown();
    });
    
    // 2. Закрытие выпадающего списка при клике вне его
    document.addEventListener('click', function(e) {
        if (!filterEl.contains(e.target) && isOpen) {
            closeDropdown();
        }
    });
    
    // 3. Обработка выбора элемента
    listItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Получаем ID платформы
            const platformId = this.dataset.platformId === "null" || !this.dataset.platformId 
                ? null 
                : parseInt(this.dataset.platformId, 10);
            
            // Устанавливаем активный класс
            listItems.forEach(i => i.classList.remove('map__platform-item_active'));
            this.classList.add('map__platform-item_active');
            
            // Обновляем текущее значение
            currentPlatformId = platformId;
            
            // Находим платформу в массиве по ID и устанавливаем её имя
            const platformName = getPlatformName(platformId, true);
            currentEl.textContent = platformName;
            
            // Закрываем выпадающий список
            closeDropdown();
            
            // Вызываем колбэк
            if (typeof onChange === 'function') {
                onChange(platformId);
            }
        });
    });
    
    // Вспомогательные функции
    
    // Получает имя платформы по её ID
    function getPlatformName(platformId, useLocalName = false) {
        if (platformId === null) {
            // Находим платформу с ID null
            const platform = platforms.find(p => p.id === null || p.id === undefined || p.id === '');
            return platform ? (useLocalName && platform.local_name ? platform.local_name : platform.name) : 'Все города';
        }
        
        // Находим платформу по ID
        const platform = platforms.find(p => p.id === platformId);
        if (!platform) return 'Неизвестная платформа';
        
        // Возвращаем локальное имя (склонение) или обычное название
        return useLocalName && platform.local_name ? platform.local_name : platform.name;
    }
    
    // Открывает/закрывает выпадающий список
    function toggleDropdown() {
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }
    
    // Открывает выпадающий список
    function openDropdown() {
        filterEl.classList.add('map__platform_open');
        isOpen = true;
    }
    
    // Закрывает выпадающий список
    function closeDropdown() {
        filterEl.classList.remove('map__platform_open');
        isOpen = false;
    }
    
    // Метод для программного изменения выбранной платформы
    function setPlatform(platformId) {
        const platformItem = Array.from(listItems).find(item => {
            const itemPlatformId = item.dataset.platformId === "null" || !item.dataset.platformId 
                ? null 
                : parseInt(item.dataset.platformId, 10);
            return itemPlatformId === platformId;
        });
        
        if (platformItem) {
            // Симулируем клик по элементу
            platformItem.click();
        } else {
            // Если элемент не найден, просто обновляем текст
            currentPlatformId = platformId;
            const platformName = getPlatformName(platformId, true);
            currentEl.textContent = platformName;
        }
    }
    
    // Возвращаем API объекта
    return {
        getCurrentPlatformId: () => currentPlatformId,
        setPlatform,
        openDropdown,
        closeDropdown
    };
}
