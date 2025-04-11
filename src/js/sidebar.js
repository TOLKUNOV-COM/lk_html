export default function sidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('sidebar__toggle');

    if (sidebar && toggleBtn) {
        let animationDuration = getComputedStyle(sidebar).getPropertyValue('--sidebar-animation-duration').trim();
        animationDuration = parseInt(animationDuration);

        toggleBtn.addEventListener('click', () => {
            if ($(sidebar).hasClass('sidebar_expanding') || $(sidebar).hasClass('sidebar_collapsing')) {
                return;
            }

            // Переключаем класс у сайдбара
            let isOpened = !$(sidebar).hasClass('sidebar_collapsed');

            if (isOpened) {
                sidebar.classList.add('sidebar_collapsing');

                setTimeout(() => {
                    sidebar.classList.add('sidebar_collapsed');
                    sidebar.classList.remove('sidebar_collapsing');
                }, animationDuration);
            } else {
                sidebar.classList.add('sidebar_expanding');
                sidebar.classList.remove('sidebar_collapsed');

                setTimeout(() => {
                    sidebar.classList.remove('sidebar_expanding');
                }, animationDuration);
            }

            // submenu
            $('.sidebar-submenu').slideToggle(animationDuration);
        });
    }
}
