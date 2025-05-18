// 本地邮件服务器，用于在本地环境中处理邮件发送请求
// 这个服务器只处理API请求，不提供静态文件服务
// 您可以继续通过浏览器直接打开HTML文件
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 加载环境变量（如果存在.env文件）
try {
    require('dotenv').config();
} catch (e) {
    console.log('dotenv模块未安装，将使用硬编码的环境变量');
}

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 8082; // 使用一个不太可能被占用的端口

// 配置CORS，允许所有来源的请求
app.use(cors({
    origin: '*', // 允许任何来源
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 日志函数
function logMessage(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);

    // 将日志写入文件
    const logDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    const logFile = path.join(logDir, 'email_log.txt');
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

// 邮件发送路由 - 与Vercel API端点保持一致
app.post('/api/send-email', async (req, res) => {
    try {
        logMessage('收到邮件发送请求');

        // 获取请求数据
        const { name, email, phone, date, time, services, message = '' } = req.body;

        // 验证必要字段
        if (!name || !email || !phone || !date || !time || !services) {
            logMessage('缺少必要字段');
            return res.status(400).json({ success: false, message: '缺少必要字段' });
        }

        logMessage(`处理预约: ${name}, ${email}, ${date} ${time}`);

        // 创建Nodemailer传输器
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER || 'naillabo3530@gmail.com',
                pass: process.env.GMAIL_APP_PASSWORD || 'kgbx nfwh ospj digq' // Gmail应用专用密码
            }
        });

        // 沙龙通知邮件
        const salonMailOptions = {
            from: '"Naillabo Booking System" <naillabo3530@gmail.com>',
            to: 'naillabo3530@gmail.com',
            subject: `New Booking: ${name} - ${date} ${time}`,
            replyTo: email,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #ff4d8d; color: white; padding: 10px; text-align: center;">
                        <h2>New Booking Notification</h2>
                        <p style="font-size: 14px; margin-top: 5px;">新预约通知</p>
                    </div>
                    <div style="padding: 20px; background-color: #f9f9f9;">
                        <p>You have received a new booking request:</p>
                        <p><strong>Customer Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone}</p>
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Time:</strong> ${time}</p>
                        <p><strong>Services:</strong><br>${services}</p>
                        ${message ? `<p><strong>Special Requests:</strong><br>${message}</p>` : ''}
                        <p>Please reply to this email to confirm the appointment with the customer.</p>
                        <p style="color: #666; font-size: 14px;"><em>请回复此邮件与客户确认预约。</em></p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
                        <p>This email was sent automatically by the Naillabo Booking System</p>
                        <p style="font-size: 11px;">此邮件由Naillabo预约系统自动发送</p>
                    </div>
                </div>
            `
        };

        // 客户确认邮件
        const customerMailOptions = {
            from: '"Naillabo Salon" <naillabo3530@gmail.com>',
            to: email,
            subject: 'Please reply with the number "1" to confirm your appointment.',
            replyTo: 'naillabo3530@gmail.com',
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <!-- Header with Logo and Gradient Background -->
                    <div style="background: linear-gradient(135deg, #ff4d8d 0%, #ff6b9d 100%); color: white; padding: 30px 20px; text-align: center;">
                        <h1 style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; color: white; margin: 0; padding: 0;">Naillabo Salon</h1>
                    </div>

                    <!-- Main Content -->
                    <div style="padding: 30px 25px; background-color: white;">
                        <p style="font-size: 16px; color: #333; margin-top: 0;">Dear ${name},</p>
                        <p style="font-size: 16px; color: #333; margin-bottom: 25px;">Thank you for booking with Naillabo Salon. Here are your appointment details:</p>

                        <!-- Appointment Details Box -->
                        <div style="background-color: #f8f9ff; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 5px solid #ff4d8d; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;">
                                        <div style="display: flex;">
                                            <div style="min-width: 24px; margin-right: 10px; color: #ff4d8d;">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z"></path></svg>
                                            </div>
                                            <div>
                                                <p style="margin: 0; color: #666; font-size: 14px;">Date</p>
                                                <p style="margin: 4px 0 0; color: #333; font-weight: 600; font-size: 16px;">${date}</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; border-bottom: 1px solid #eaeaea;">
                                        <div style="display: flex;">
                                            <div style="min-width: 24px; margin-right: 10px; color: #ff4d8d;">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"></path></svg>
                                            </div>
                                            <div>
                                                <p style="margin: 0; color: #666; font-size: 14px;">Time</p>
                                                <p style="margin: 4px 0 0; color: #333; font-weight: 600; font-size: 16px;">${time}</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0;">
                                        <div style="display: flex;">
                                            <div style="min-width: 24px; margin-right: 10px; color: #ff4d8d;">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z"></path></svg>
                                            </div>
                                            <div>
                                                <p style="margin: 0; color: #666; font-size: 14px;">Services</p>
                                                <p style="margin: 4px 0 0; color: #333; font-weight: 600; font-size: 16px;">${services}</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                ${message ? `
                                <tr>
                                    <td style="padding: 8px 0; border-top: 1px solid #eaeaea;">
                                        <div style="display: flex;">
                                            <div style="min-width: 24px; margin-right: 10px; color: #ff4d8d;">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H6L4,18V4H20"></path></svg>
                                            </div>
                                            <div>
                                                <p style="margin: 0; color: #666; font-size: 14px;">Special Requests</p>
                                                <p style="margin: 4px 0 0; color: #333; font-size: 16px;">${message}</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>` : ''}
                            </table>
                        </div>

                        <!-- Confirmation Instructions -->
                        <div style="background-color: #fff5f8; border-radius: 8px; padding: 15px; margin: 25px 0; text-align: center;">
                            <p style="font-size: 16px; font-weight: 600; color: #ff4d8d; margin: 0 0 10px;">Please reply with the number "1" to confirm your appointment</p>
                            <p style="font-size: 14px; color: #666; margin: 0;"><em>请回复数字"1"确认您的预约</em></p>
                        </div>

                        <p style="font-size: 16px; color: #333;">If you have any questions, please contact us at <a href="tel:604.998.7666" style="color: #ff4d8d; text-decoration: none; font-weight: 600;">604.998.7666</a></p>
                        <p style="font-size: 16px; color: #333;">We look forward to serving you!</p>
                        <p style="font-size: 16px; color: #333; font-weight: 600;">Naillabo Salon Team</p>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
                        <p style="margin: 0 0 10px; color: #666; font-size: 14px;">Aberdeen Center, 3530-4151 Hazelbridge Way, Richmond BC</p>
                        <p style="margin: 0 0 5px; color: #666; font-size: 14px;">
                            <a href="tel:604.998.7666" style="color: #ff4d8d; text-decoration: none;">Phone: 604.998.7666</a> |
                            <a href="mailto:naillabo3530@gmail.com" style="color: #ff4d8d; text-decoration: none;">Email: naillabo3530@gmail.com</a>
                        </p>

                    </div>
                </div>
            `
        };

        // 发送沙龙通知邮件
        logMessage('正在发送沙龙通知邮件...');
        const salonInfo = await transporter.sendMail(salonMailOptions);
        logMessage(`沙龙通知邮件发送成功: ${salonInfo.messageId}`);

        // 发送客户确认邮件
        logMessage('正在发送客户确认邮件...');
        const customerInfo = await transporter.sendMail(customerMailOptions);
        logMessage(`客户确认邮件发送成功: ${customerInfo.messageId}`);

        // 返回成功响应
        return res.status(200).json({
            success: true,
            message: '预约成功！确认邮件已发送。',
            salonMailId: salonInfo.messageId,
            customerMailId: customerInfo.messageId
        });

    } catch (error) {
        logMessage(`邮件发送错误: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: '邮件发送失败，请稍后再试。',
            error: error.message
        });
    }
});

// 添加一个简单的测试路由
app.get('/', (req, res) => {
    res.send(`
        <h1>Naillabo 本地邮件服务器</h1>
        <p>这个服务器只处理API请求，不提供静态文件服务。</p>
        <p>您可以继续通过浏览器直接打开HTML文件，例如：</p>
        <ul>
            <li><a href="file://${path.resolve(__dirname, 'book.html')}" target="_blank">book.html</a> (可能需要手动复制链接)</li>
            <li><a href="file://${path.resolve(__dirname, 'book-new.html')}" target="_blank">book-new.html</a> (可能需要手动复制链接)</li>
        </ul>
        <p>API端点: <code>http://localhost:${PORT}/api/send-email</code></p>
        <p>服务器状态: <span style="color: green; font-weight: bold;">运行中</span></p>
    `);
});

// 添加一个测试邮件发送的路由
app.get('/test-email', (req, res) => {
    res.send(`
        <h1>测试邮件发送</h1>
        <form id="test-form" style="max-width: 500px; margin: 0 auto;">
            <div style="margin-bottom: 15px;">
                <label for="name" style="display: block; margin-bottom: 5px;">姓名:</label>
                <input type="text" id="name" name="name" value="测试用户" style="width: 100%; padding: 8px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label for="email" style="display: block; margin-bottom: 5px;">邮箱:</label>
                <input type="email" id="email" name="email" value="naillabo3530@gmail.com" style="width: 100%; padding: 8px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label for="phone" style="display: block; margin-bottom: 5px;">电话:</label>
                <input type="text" id="phone" name="phone" value="604.998.7666" style="width: 100%; padding: 8px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label for="date" style="display: block; margin-bottom: 5px;">日期:</label>
                <input type="text" id="date" name="date" value="${new Date().toLocaleDateString()}" style="width: 100%; padding: 8px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label for="time" style="display: block; margin-bottom: 5px;">时间:</label>
                <input type="text" id="time" name="time" value="${new Date().toLocaleTimeString()}" style="width: 100%; padding: 8px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label for="services" style="display: block; margin-bottom: 5px;">服务:</label>
                <textarea id="services" name="services" style="width: 100%; padding: 8px; height: 100px;">测试服务</textarea>
            </div>
            <div style="margin-bottom: 15px;">
                <label for="message" style="display: block; margin-bottom: 5px;">留言:</label>
                <textarea id="message" name="message" style="width: 100%; padding: 8px; height: 100px;">这是一封测试邮件，用于验证本地邮件服务器是否正常工作。</textarea>
            </div>
            <button type="submit" style="background-color: #4CAF50; color: white; padding: 10px 15px; border: none; cursor: pointer;">发送测试邮件</button>
        </form>
        <div id="result" style="margin-top: 20px; padding: 10px;"></div>

        <script>
            document.getElementById('test-form').addEventListener('submit', function(e) {
                e.preventDefault();

                const resultDiv = document.getElementById('result');
                resultDiv.innerHTML = '<p style="color: blue;">正在发送邮件...</p>';

                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    date: document.getElementById('date').value,
                    time: document.getElementById('time').value,
                    services: document.getElementById('services').value,
                    message: document.getElementById('message').value
                };

                fetch('http://localhost:${PORT}/api/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        resultDiv.innerHTML = '<p style="color: green; font-weight: bold;">邮件发送成功！</p><pre>' + JSON.stringify(data, null, 2) + '</pre>';
                    } else {
                        resultDiv.innerHTML = '<p style="color: red; font-weight: bold;">邮件发送失败！</p><pre>' + JSON.stringify(data, null, 2) + '</pre>';
                    }
                })
                .catch(error => {
                    resultDiv.innerHTML = '<p style="color: red; font-weight: bold;">发生错误：' + error.message + '</p>';
                });
            });
        </script>
    `);
});

// 添加一个简单的错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    logMessage(`服务器错误: ${err.message}`);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: err.message
    });
});

// 添加一个通配符路由，处理所有未匹配的请求
app.use('*', (req, res) => {
    console.log(`收到未匹配的请求: ${req.method} ${req.originalUrl}`);
    logMessage(`收到未匹配的请求: ${req.method} ${req.originalUrl}`);
    res.status(404).send(`
        <h1>404 - 页面未找到</h1>
        <p>请求的路径 "${req.originalUrl}" 不存在。</p>
        <p>可用的路径:</p>
        <ul>
            <li><a href="/">首页</a></li>
            <li><a href="/test-email">测试邮件发送</a></li>
            <li><a href="/api/send-email">邮件API端点 (仅支持POST请求)</a></li>
        </ul>
    `);
});

// 启动服务器
const server = app.listen(PORT, () => {
    logMessage(`本地邮件服务器已启动，监听端口 ${PORT}`);
    logMessage(`API端点: http://localhost:${PORT}/api/send-email`);
    logMessage(`测试页面: http://localhost:${PORT}/test-email`);
    logMessage(`您可以继续通过浏览器直接打开HTML文件，系统将使用此服务器处理API请求`);

    // 输出服务器地址信息
    const interfaces = require('os').networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                logMessage(`可通过 http://${iface.address}:${PORT} 访问服务器`);
            }
        }
    }
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`错误: 端口 ${PORT} 已被占用，请尝试使用其他端口`);
        logMessage(`错误: 端口 ${PORT} 已被占用，请尝试使用其他端口`);
    } else {
        console.error('服务器启动错误:', err);
        logMessage(`服务器启动错误: ${err.message}`);
    }
});
