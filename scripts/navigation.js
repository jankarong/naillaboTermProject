document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    // 点击菜单按钮时切换导航菜单
    mobileMenuToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // 点击导航链接时关闭菜单（排除服务下拉菜单）
    const navLinks = document.querySelectorAll('.mobile-menu .nav-links a:not(.services-dropdown > a)');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });

    // 滚动时添加阴影效果
    window.addEventListener('scroll', function () {
        const header = document.querySelector('.site-header');
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 添加移动端服务下拉菜单的交互
    const serviceDropdown = document.querySelector('.mobile-menu .services-dropdown');
    const serviceLink = serviceDropdown.querySelector('a');
    const chevronIcon = serviceLink.querySelector('.fa-chevron-down');

    serviceLink.addEventListener('click', function (e) {
        e.preventDefault();
        serviceDropdown.classList.toggle('active');
        chevronIcon.style.transform = serviceDropdown.classList.contains('active') ? 'rotate(0deg)' : 'rotate(-90deg)';
    });

    // 点击下拉菜单项时才关闭整个导航
    const dropdownLinks = document.querySelectorAll('.mobile-menu .dropdown-menu a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            serviceDropdown.classList.remove('active');
            chevronIcon.style.transform = 'rotate(-90deg)';
        });
    });
});