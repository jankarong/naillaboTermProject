// 简单的Node.js邮件发送服务器
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// 加载环境变量（如果存在.env文件）
try {
    require('dotenv').config();
} catch (e) {
    console.log('dotenv模块未安装，将使用硬编码的环境变量');
}

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 日志函数
function logMessage(message) {
    const logFile = path.join(__dirname, 'email_log.txt');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
    console.log(`[${timestamp}] ${message}`);
}

// 创建Nodemailer传输器
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'naillabo3530@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || 'kgbx nfwh ospj digq' // Gmail应用专用密码
    }
});

// 邮件发送路由
app.post('/send-email', async (req, res) => {
    try {
        logMessage('收到邮件发送请求');

        // 验证必要字段
        const requiredFields = ['name', 'email', 'phone', 'date', 'time', 'services'];
        const missingFields = [];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            logMessage(`错误: 缺少必要字段: ${missingFields.join(', ')}`);
            return res.status(400).json({
                success: false,
                message: `缺少必要字段: ${missingFields.join(', ')}`
            });
        }

        // 提取数据
        const { name, email, phone, date, time, services } = req.body;
        const message = req.body.message || '';

        logMessage(`处理预约: ${name}, ${email}, ${date} ${time}`);

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
        res.json({
            success: true,
            message: '预约成功！确认邮件已发送。',
            salonMailId: salonInfo.messageId,
            customerMailId: customerInfo.messageId
        });

    } catch (error) {
        logMessage(`邮件发送错误: ${error.message}`);
        res.status(500).json({
            success: false,
            message: '邮件发送失败，请稍后再试。',
            error: error.message
        });
    }
});

// 启动服务器
app.listen(PORT, () => {
    logMessage(`邮件服务器已启动，监听端口 ${PORT}`);
});
