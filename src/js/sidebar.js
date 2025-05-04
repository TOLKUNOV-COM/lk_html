export default function sidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('sidebar__toggle');

    if (sidebar && toggleBtn) {
        let animationDuration = 500; //getComputedStyle(sidebar).getPropertyValue('--sidebar-animation-duration').trim();
        // animationDuration = parseInt(animationDuration);

        // Восстановление состояния при загрузке страницы
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true' && !sidebar.classList.contains('sidebar_collapsed')) {
            sidebar.classList.add('sidebar_collapsed');
            $('.sidebar-submenu').hide();
        }
        $('.sidebar-initially-collapsed').removeClass('sidebar-initially-collapsed');

        toggleBtn.addEventListener('click', () => {
            if ($(sidebar).hasClass('sidebar_expanding') || $(sidebar).hasClass('sidebar_collapsing')) {
                return;
            }

            // Переключаем класс у сайдбара
            let isOpened = !$(sidebar).hasClass('sidebar_collapsed');
            const eventStart = new CustomEvent('sidebar:collapse:start');
            const eventEnd = new CustomEvent('sidebar:collapse:end');

            if (isOpened) {
                sidebar.classList.add('sidebar_collapsing');
                document.dispatchEvent(eventStart);

                setTimeout(() => {
                    sidebar.classList.add('sidebar_collapsed');
                    sidebar.classList.remove('sidebar_collapsing');

                    document.dispatchEvent(eventEnd);
                }, animationDuration);
            } else {
                sidebar.classList.add('sidebar_expanding');
                sidebar.classList.remove('sidebar_collapsed');
                document.dispatchEvent(eventStart);

                setTimeout(() => {
                    sidebar.classList.remove('sidebar_expanding');

                    document.dispatchEvent(eventEnd);
                }, animationDuration);
            }

            // submenu
            $('.sidebar-submenu').slideToggle(animationDuration);
            
            // Сохраняем состояние в localStorage
            localStorage.setItem('sidebarCollapsed', isOpened ? 'true' : 'false');
        });
    }
}
