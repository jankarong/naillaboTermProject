// Vercel Serverless Function for sending emails
const nodemailer = require('nodemailer');

// Vercel 环境变量在部署时设置，这里提供一个默认值作为备份
const GMAIL_USER = process.env.GMAIL_USER || 'naillabo3530@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'kgbx nfwh ospj digq';

// 创建日志函数
function logMessage(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD // Use environment variable for security
  }
});

// Function to send confirmation email to customer
async function sendCustomerConfirmationEmail(data) {
  const { name, email, date, time, services, message } = data;

  // Format the date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Create HTML content for the email
  const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #ff4d8d; margin: 0;">Naillabo Salon</h1>
                <p style="color: #666; margin: 5px 0;">Appointment Confirmation Request</p>
            </div>

            <div style="background-color: #fff5f8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #ff4d8d; margin-top: 0;">Important: Two-Step Confirmation Process</h2>
                <ol style="color: #333; line-height: 1.6;">
                    <li>Please reply to this email with the number "1" to confirm your appointment request.</li>
                    <li><strong style="color: #ff4d8d;">Wait for our confirmation email. Your appointment is not confirmed until you receive our confirmation email.</strong></li>
                </ol>
                <p style="color: #666; font-style: italic;">We will review your request and send a confirmation email within 24 hours.</p>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #333; margin-top: 0;">Appointment Details</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Services:</strong></p>
                <ul style="margin: 0; padding-left: 20px;">
                    ${services.split('\n').map(service => `<li>${service.trim()}</li>`).join('')}
                </ul>
                ${message ? `<p><strong>Special Requests:</strong> ${message}</p>` : ''}
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="color: #666; margin: 0;">Please reply with "1" to confirm your appointment request.</p>
                <p style="color: #666; margin: 5px 0;">We look forward to serving you!</p>
            </div>
        </div>
    `;

  // Email options
  const mailOptions = {
    from: 'Naillabo Salon <naillabo3530@gmail.com>',
    to: email,
    subject: "Please reply with '1' to confirm your appointment / 请回复数字'1'确认您的预约",
    html: htmlContent
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Customer confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending customer confirmation email:', error);
    throw error;
  }
}

// Function to send notification email to salon
async function sendSalonNotificationEmail(data) {
  const { name, email, phone, date, time, services, message } = data;

  // Format the date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Create HTML content for the email
  const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #ff4d8d; margin: 0;">New Booking Request</h1>
                <p style="color: #666; margin: 5px 0;">Please review and confirm this appointment</p>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #333; margin-top: 0;">Customer Information</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
            </div>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #333; margin-top: 0;">Appointment Details</h3>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${time}</p>
                <p><strong>Services:</strong></p>
                <ul style="margin: 0; padding-left: 20px;">
                    ${services.split('\n').map(service => `<li>${service.trim()}</li>`).join('')}
                </ul>
                ${message ? `<p><strong>Special Requests:</strong> ${message}</p>` : ''}
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <p style="color: #666; margin: 0;">Please review this booking request and send a confirmation email to the customer.</p>
            </div>
        </div>
    `;

  // Email options
  const mailOptions = {
    from: 'Naillabo Booking System <naillabo3530@gmail.com>',
    to: 'naillabo3530@gmail.com',
    subject: `New Booking: ${name} - ${formattedDate} ${time}`,
    html: htmlContent
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Salon notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending salon notification email:', error);
    throw error;
  }
}

// 处理请求的主函数
module.exports = async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 处理OPTIONS请求（预检请求）
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 只接受POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: '只接受POST请求' });
  }

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

    // 发送沙龙通知邮件
    logMessage('正在发送沙龙通知邮件...');
    const salonInfo = await sendSalonNotificationEmail({ name, email, phone, date, time, services, message });
    logMessage(`沙龙通知邮件发送成功: ${salonInfo.messageId}`);

    // 发送客户确认邮件
    logMessage('正在发送客户确认邮件...');
    logMessage(`客户邮件将发送至: ${email}`);
    const customerInfo = await sendCustomerConfirmationEmail({ name, email, date, time, services, message });
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
    logMessage(`错误详情: ${JSON.stringify(error)}`);
    logMessage(`错误堆栈: ${error.stack}`);
    return res.status(500).json({
      success: false,
      message: '邮件发送失败，请稍后再试。',
      error: error.message,
      stack: error.stack
    });
  }
};
