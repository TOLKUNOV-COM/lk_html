import Hammer from 'hammerjs';

/**
 * Инициализирует touch-скролл на элементе с помощью Hammer.js
 * @param {HTMLElement} element - элемент, на котором нужно инициализировать скролл
 * @param {Object} options - опции инициализации
 * @param {string} options.direction - направление скролла: 'horizontal' или 'vertical'
 */
export function initTouchScroll(element, options = {}) {
    if (!element) return;

    const defaults = {
        direction: 'horizontal' // По умолчанию горизонтальный скролл
    };

    const settings = { ...defaults, ...options };
    
    try {
        const hammer = new Hammer(element);
        
        // Выбор направления в зависимости от настроек
        const panDirection = settings.direction === 'vertical' 
            ? Hammer.DIRECTION_VERTICAL 
            : Hammer.DIRECTION_HORIZONTAL;
        
        // Настройка распознавания жестов
        hammer.get('pan').set({ direction: panDirection });
        
        let startPosition = 0;
        
        hammer.on('panstart', (e) => {
            // Сохраняем стартовую позицию в зависимости от направления
            if (settings.direction === 'vertical') {
                startPosition = element.scrollTop;
            } else {
                startPosition = element.scrollLeft;
            }
            
            // Добавляем класс активного перетаскивания
            element.classList.add('touch-scroll-active');
        });
        
        hammer.on('panmove', (e) => {
            // Обновляем скролл в зависимости от направления
            if (settings.direction === 'vertical') {
                element.scrollTop = startPosition - e.deltaY;
            } else {
                element.scrollLeft = startPosition - e.deltaX;
            }
            
            e.preventDefault(); // Предотвращаем стандартное поведение
        });
        
        hammer.on('panend', () => {
            // Удаляем класс активного перетаскивания
            element.classList.remove('touch-scroll-active');
        });

        // Добавляем метку, что скролл инициализирован
        element.setAttribute('data-touch-scroll-initialized', 'true');
        
        return hammer;
    } catch (error) {
        console.warn('Ошибка при инициализации touch-scroll:', error);
        return null;
    }
}

/**
 * Инициализирует touch-скролл на всех элементах с классом touch-scroll
 */
export default function initAllTouchScroll() {
    document.querySelectorAll('.touch-scroll:not([data-touch-scroll-initialized])').forEach(el => {
        const direction = el.getAttribute('data-scroll-direction') || 'horizontal';
        initTouchScroll(el, { direction });
    });
} 