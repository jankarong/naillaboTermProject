/**
 * API处理脚本
 * 用于处理预约表单的API调用，直接使用Gmail应用专用密码
 */

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    console.log('API handler script loaded');

    // 定义发送邮件函数，使用Vercel API端点
    window.sendBookingEmail = function (data) {
        return new Promise((resolve, reject) => {
            try {
                console.log('Sending email using Gmail app password via Vercel API...');

                // 构建API URL - 根据环境使用不同的URL
                let apiUrl = '/api/send-email';

                // 检测是否在本地环境
                const isLocalhost = window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.includes('192.168.') ||
                    window.location.protocol === 'file:';

                // 如果是本地环境，使用本地服务器API端点
                if (isLocalhost) {
                    apiUrl = 'http://localhost:8082/api/send-email';
                    console.log('本地环境检测：使用本地API端点', apiUrl);
                }

                // 即使在本地环境中也实际发送邮件
                if (isLocalhost) {
                    console.log('检测到本地环境，但将实际发送邮件以进行测试');

                    // 确保邮件发送到正确的地址
                    if (data.email !== 'naillabo3530@gmail.com') {
                        console.log(`本地环境实际邮件发送：客户邮件将发送至 ${data.email}`);
                        console.log('本地环境实际邮件发送：沙龙通知邮件将发送至 naillabo3530@gmail.com');
                    } else {
                        console.log('本地环境实际邮件发送：测试邮件将发送至 naillabo3530@gmail.com');
                    }

                    // 继续执行实际的API调用，不返回
                }

                // 发送POST请求
                fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            console.log('Email sent successfully:', result);
                            resolve(true);
                        } else {
                            console.error('Failed to send email:', result.message);
                            resolve(false);
                        }
                    })
                    .catch(error => {
                        console.error('Error sending email:', error);
                        resolve(false);
                    });
            } catch (error) {
                console.error('Error in sendBookingEmail:', error);
                reject(error);
            }
        });
    };

    // 为了兼容性，也定义旧的函数名
    window.sendConfirmationEmail = window.sendBookingEmail;

    // 测试函数已移除
});
