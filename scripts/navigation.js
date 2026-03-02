document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    // 点击菜单按钮时切换导航菜单
    mobileMenuToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // 点击导航链接时关闭菜单（排除下拉菜单触发项）
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

    // 添加移动端下拉菜单的交互（支持多个下拉）
    const dropdownGroups = document.querySelectorAll('.mobile-menu .services-dropdown');
    dropdownGroups.forEach(group => {
        const triggerLink = group.querySelector(':scope > a');
        const triggerIcon = triggerLink ? triggerLink.querySelector('.fa-chevron-down') : null;
        if (!triggerLink) return;

        triggerLink.addEventListener('click', function (e) {
            e.preventDefault();
            group.classList.toggle('active');
            if (triggerIcon) {
                triggerIcon.style.transform = group.classList.contains('active') ? 'rotate(0deg)' : 'rotate(-90deg)';
            }
        });
    });

    // 点击下拉菜单项时才关闭整个导航
    const dropdownLinks = document.querySelectorAll('.mobile-menu .dropdown-menu a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            dropdownGroups.forEach(group => {
                group.classList.remove('active');
                const icon = group.querySelector(':scope > a .fa-chevron-down');
                if (icon) icon.style.transform = 'rotate(-90deg)';
            });
        });
    });
});
