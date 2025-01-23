document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.testimonials-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.slider-dot');
    let currentIndex = 0;
    const slides = document.querySelectorAll('.testimonials-slider .testimonial-card');
    const totalSlides = slides.length;

    // 初始化滑块
    function initSlider() {
        // 重置滑块容器和滑块项的宽度
        const containerWidth = slider.parentElement.offsetWidth;

        // 设置每个滑块项的宽度为容器宽度
        slides.forEach(slide => {
            slide.style.width = `${containerWidth}px`;
            slide.style.flex = '0 0 auto'; // 防止弹性布局影响宽度
        });

        // 设置滑块容器的宽度为所有滑块项宽度之和
        slider.style.width = `${containerWidth * totalSlides}px`;
        slider.style.display = 'flex';  // 确保使用flex布局

        // 立即更新到当前位置
        updateSlider(false);
    }

    // 更新滑块位置
    function updateSlider(animate = true) {
        const containerWidth = slider.parentElement.offsetWidth;
        const translateX = -containerWidth * currentIndex;

        // 添加或移除过渡动画
        slider.style.transition = animate ? 'transform 0.3s ease-in-out' : 'none';
        slider.style.transform = `translateX(${translateX}px)`;

        // 更新圆点状态
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // 更新按钮状态
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalSlides - 1;
    }

    // 绑定按钮事件
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    // 绑定圆点事件
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });

    // 处理窗口大小变化
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // 使用防抖处理resize事件
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initSlider();
        }, 250);
    });

    // 初始化滑块
    initSlider();
}); 