export default function initFacts() {
    const factsSlider = document.getElementById('stats-facts-love');
    if (!factsSlider) return;

    let isAnimating = false;

    factsSlider.addEventListener('click', function () {
        if (isAnimating) return;

        isAnimating = true;
        this.classList.toggle('stats-facts__love_active');

        // Разблокировать повторные клики после завершения анимации
        setTimeout(() => {
            isAnimating = false;
        }, 500); // 500ms (длительность анимации)
    });
}
