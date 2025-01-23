document.addEventListener('DOMContentLoaded', function () {
    const wechatLinks = document.querySelectorAll('.wechat-link');
    const modal = document.querySelector('.wechat-qr-modal');
    const closeButton = document.querySelector('.close-qr-modal');

    if (!modal || !closeButton) {
        console.error('Some elements are missing:', {
            modal: !!modal,
            closeButton: !!closeButton
        });
        return;
    }

    wechatLinks.forEach(wechatLink => {
        wechatLink.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('WeChat link clicked');
            modal.classList.add('active');
        });
    });

    closeButton.addEventListener('click', function () {
        console.log('Close button clicked');
        modal.classList.remove('active');
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            console.log('Modal background clicked');
            modal.classList.remove('active');
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            console.log('Escape key pressed');
            modal.classList.remove('active');
        }
    });
}); 