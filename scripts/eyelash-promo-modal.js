/**
 * 中式美睫优惠弹窗脚本 - 简化版
 * 控制弹窗的显示和关闭
 */

// 等待页面完全加载
window.onload = function() {
    console.log('Window loaded - Eyelash promo script running');
    
    // 获取弹窗元素
    const promoModal = document.getElementById('eyelashPromoModal');
    console.log('Promo modal element:', promoModal);
    
    if (!promoModal) {
        console.error('弹窗元素未找到！');
        return;
    }
    
    // 获取关闭按钮
    const closeBtn = document.querySelector('.close-promo-modal');
    const noThanksBtn = document.getElementById('noThanksBtn');
    const bookNowBtn = document.getElementById('bookNowBtn');
    
    // 关闭弹窗的函数 - 简化版
    function closePromoModal() {
        console.log('关闭弹窗');
        promoModal.style.display = 'none';
        promoModal.classList.remove('active');
    }
    
    // 点击关闭按钮关闭弹窗
    if (closeBtn) {
        console.log('添加关闭按钮事件');
        closeBtn.addEventListener('click', closePromoModal);
    } else {
        console.error('关闭按钮未找到！');
    }
    
    // 点击"No Thanks"按钮关闭弹窗
    if (noThanksBtn) {
        console.log('添加No Thanks按钮事件');
        noThanksBtn.addEventListener('click', closePromoModal);
    } else {
        console.error('No Thanks按钮未找到！');
    }
    
    // 点击"Book Now"按钮关闭弹窗
    if (bookNowBtn) {
        console.log('添加Book Now按钮事件');
        bookNowBtn.addEventListener('click', closePromoModal);
    } else {
        console.error('Book Now按钮未找到！');
    }
    
    // 点击弹窗外部区域关闭弹窗
    promoModal.addEventListener('click', function(event) {
        if (event.target === promoModal) {
            closePromoModal();
        }
    });
    
    // 直接显示弹窗（1秒后）
    setTimeout(function() {
        console.log('显示弹窗');
        promoModal.style.display = 'flex';
        promoModal.classList.add('active');
    }, 1000);
    
    // 添加直接显示弹窗的按钮（用于测试）
    const testButton = document.createElement('button');
    testButton.textContent = '显示美睫优惠';
    testButton.style.position = 'fixed';
    testButton.style.bottom = '20px';
    testButton.style.right = '20px';
    testButton.style.zIndex = '999';
    testButton.style.padding = '10px';
    testButton.style.backgroundColor = '#e77979';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '5px';
    testButton.style.cursor = 'pointer';
    
    testButton.addEventListener('click', function() {
        promoModal.style.display = 'flex';
        promoModal.classList.add('active');
    });
    
    document.body.appendChild(testButton);
};
