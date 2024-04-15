const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/send_email', (req, res) => {
    const { username, email, phone, message } = req.body;
    console.log("Received request:", req.body);  // 正确记录请求数据

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',  // SMTP 服务器
        port: 465,
        secure: true,  // 如果是 465 端口使用 true
        auth: {
            user: 'naillabo5@gmail.com',  // 你的邮箱账号
            pass: 'naillabobook'  // 你的邮箱密码
        }
    });

    const mailOptions = {
        from: 'naillabo5@gmail.com',
        to: 'jankarong@gmail.com',  // 收件人邮箱，可以是你自己的邮箱
        subject: 'New Submission from Website',
        text: `You received a message from:\n\n Name: ${username}\n Email: ${email}\n Phone: ${phone}\n Message: ${message}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email.');  // 使用状态码 500 表示服务器内部错误
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully!');  // 确认邮件发送成功
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
