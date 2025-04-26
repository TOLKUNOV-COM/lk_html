export default function favoriteButton() {
    $(document).on('click', '.js-toggle-favorite', function (e) {
        e.preventDefault();

        if (typeof toggleFavoriteUrl === 'undefined') {
            console.error('toggleFavoriteUrl is not defined');
            return false;
        }

        const $button = $(this);

        // Если кнопка уже в процессе обработки, игнорируем повторные клики
        if ($button.hasClass('processing')) {
            return false;
        }

        // Получаем ID проекта из data-атрибута кнопки
        const projectId = $button.data('project-id');

        // Если ID не найден, выходим
        if (!projectId) {
            console.error('Project ID not found');
            return false;
        }

        // Устанавливаем флаг, что кнопка в процессе обработки
        $button.addClass('processing');

        let realUrl = toggleFavoriteUrl.replace('__ID__', projectId);

        // Отправляем AJAX-запрос для переключения статуса избранного
        $.ajax({
            url: realUrl,
            type: 'POST',
            dataType: 'json',
            data: {
                [yupeTokenName]: yupeToken
            },
            success: function (response) {
                if (response.success) {
                    // Обновляем визуальное состояние кнопки в зависимости от нового значения is_favorite
                    if (response.is_favorite) {
                        $button.addClass('js-toggle-favorite_active');
                    } else {
                        $button.removeClass('js-toggle-favorite_active');
                    }
                } else {
                    console.error('Failed to toggle favorite status');
                }
            },
            error: function (xhr, status, error) {
                console.error('Error toggling favorite status:', error);
            },
            complete: function () {
                // Снимаем флаг обработки, позволяя повторные клики
                $button.removeClass('processing');
            }
        });

        return false;
    });
}
