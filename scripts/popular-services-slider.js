document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.popular-services-slider');
    const slides = document.querySelectorAll('.popular-services-slider .popular-service-card');
    const prevBtn = document.querySelector('.popular-services-mobile .prev-btn');
    const nextBtn = document.querySelector('.popular-services-mobile .next-btn');
    const dots = document.querySelectorAll('.popular-services-mobile .slider-dot');

    let currentSlide = 0;

    // 滑动到指定slide
    function goToSlide(index) {
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        currentSlide = index;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`; // 使用百分比
        updateDots();
    }

    // 更新dots的active状态
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // 事件监听
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    });

    slider.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) { // 最小滑动距离
            if (diff > 0) {
                goToSlide(currentSlide + 1);
            } else {
                goToSlide(currentSlide - 1);
            }
        }
    });

    // 初始化
    goToSlide(0);
}); 