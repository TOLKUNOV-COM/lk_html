import Swiper from 'swiper/bundle';
// import 'swiper/css';

export default function tabs() {
    document.querySelectorAll('.tab-group').forEach((groupEl) => {
        const swiperEl = groupEl.querySelector(':scope > .tab-swiper');

        if (!swiperEl) {
            return;
        }

        const swiper = new Swiper(swiperEl, {
            autoHeight: true,
            speed: 300,
            spaceBetween: 0,
            allowTouchMove: true,
            touchStartPreventDefault: false,
            noSwiping: true,
            noSwipingClass: 'swiper-no-swiping',
        });

        const tabButtons = groupEl.querySelectorAll(':scope > .tab-buttons > .tab-btn');

        tabButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                swiper.slideTo(index);
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // начальная активная таба
        if (tabButtons[0]) {
            tabButtons[0].classList.add('active');
        }
    });
}
