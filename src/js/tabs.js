import Swiper from 'swiper/bundle';
// import 'swiper/css';

export default function tabs() {
    document.querySelectorAll('.tab-group').forEach((groupEl) => {
        const swiperEl = groupEl.querySelector('.tab-swiper');

        const swiper = new Swiper(swiperEl, {
            autoHeight: true,
            speed: 300,
            spaceBetween: 0,
            allowTouchMove: true,
            touchStartPreventDefault: false,
            noSwiping: true,
            noSwipingClass: 'swiper-no-swiping',
        });

        const tabButtons = groupEl.querySelectorAll('.tab-btn');

        tabButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                swiper.slideTo(index);
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // начальная активная таба
        tabButtons[0]?.classList.add('active');
    });
}
