export default function simpleTabs() {
    document.querySelectorAll('.simple-tab-group').forEach((groupEl) => {
        const buttons = groupEl.querySelectorAll(':scope > .simple-tab-buttons > .simple-tab-btn');
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
