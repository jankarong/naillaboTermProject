document.addEventListener('DOMContentLoaded', function () {
    const wechatIcon = document.getElementById('wechat-icon');
    const qrPopup = document.getElementById('qr-popup');
    const closePopup = document.getElementById('close-popup');

    console.log('Close button:', closePopup); // 检查是否正确获取到关闭按钮

    wechatIcon.addEventListener('click', function (e) {
        console.log('WeChat icon clicked');
        e.preventDefault();
        qrPopup.style.display = 'block';
    });

    closePopup.addEventListener('click', function () {
        console.log('Close button clicked'); // 添加这行
        qrPopup.style.display = 'none';
    });

    // 其余代码保持不变
});