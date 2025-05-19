<?php
// 设置错误报告
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 设置响应头
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// 记录日志函数
function logMessage($message) {
    $logFile = 'email_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// 记录开始处理请求
logMessage("开始处理邮件请求");

// 检查请求方法
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    logMessage("错误: 只接受POST请求");
    echo json_encode(['success' => false, 'message' => '只接受POST请求']);
    exit;
}

// 获取POST数据
$postData = json_decode(file_get_contents('php://input'), true);
if (!$postData) {
    $postData = $_POST;
}

// 记录接收到的数据
logMessage("接收到的数据: " . json_encode($postData));

// 验证必要字段
$requiredFields = ['name', 'email', 'phone', 'date', 'time', 'services'];
$missingFields = [];

foreach ($requiredFields as $field) {
    if (empty($postData[$field])) {
        $missingFields[] = $field;
    }
}

if (!empty($missingFields)) {
    logMessage("错误: 缺少必要字段: " . implode(', ', $missingFields));
    echo json_encode(['success' => false, 'message' => '缺少必要字段: ' . implode(', ', $missingFields)]);
    exit;
}

// 提取数据
$name = $postData['name'];
$email = $postData['email'];
$phone = $postData['phone'];
$date = $postData['date'];
$time = $postData['time'];
$services = $postData['services'];
$message = isset($postData['message']) ? $postData['message'] : '';

// 设置邮件参数
$to = 'naillabo3530@gmail.com'; // 沙龙邮箱
$customerEmail = $email; // 客户邮箱

// 创建沙龙通知邮件
$salonSubject = "New Booking: $name - $date $time";
$salonHeaders = "From: Naillabo Booking System <naillabo3530@gmail.com>\r\n";
$salonHeaders .= "Reply-To: $email\r\n";
$salonHeaders .= "MIME-Version: 1.0\r\n";
$salonHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";

$salonBody = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ff4d8d; color: white; padding: 10px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Booking Notification</h2>
            <p style="font-size: 14px; margin-top: 5px;">新预约通知</p>
        </div>
        <div class='content'>
            <p>You have received a new booking request:</p>
            <p><strong>Customer Name:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Phone:</strong> $phone</p>
            <p><strong>Date:</strong> $date</p>
            <p><strong>Time:</strong> $time</p>
            <p><strong>Services:</strong><br>$services</p>
            " . ($message ? "<p><strong>Special Requests:</strong><br>$message</p>" : "") . "
            <p>Please reply to this email to confirm the appointment with the customer.</p>
            <p style=\"color: #666; font-size: 14px;\"><em>请回复此邮件与客户确认预约。</em></p>
        </div>
        <div class='footer'>
            <p>This email was sent automatically by the Naillabo Booking System</p>
            <p style="font-size: 11px;">此邮件由Naillabo预约系统自动发送</p>
        </div>
    </div>
</body>
</html>
";

// 创建客户确认邮件
$customerSubject = "Please reply with the number \"1\" to confirm your appointment.";
$customerHeaders = "From: Naillabo Salon <naillabo3530@gmail.com>\r\n";
$customerHeaders .= "Reply-To: naillabo3530@gmail.com\r\n";
$customerHeaders .= "MIME-Version: 1.0\r\n";
$customerHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";

$customerBody = "
<html>
<head>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ff4d8d 0%, #ff6b9d 100%); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 25px; background-color: white; }
        .details-box { background-color: #f8f9ff; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 5px solid #ff4d8d; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .details-row { padding: 8px 0; border-bottom: 1px solid #eaeaea; display: flex; }
        .details-row:last-child { border-bottom: none; }
        .icon { min-width: 24px; margin-right: 10px; color: #ff4d8d; }
        .label { margin: 0; color: #666; font-size: 14px; }
        .value { margin: 4px 0 0; color: #333; font-weight: 600; font-size: 16px; }
        .confirm-box { background-color: #fff5f8; border-radius: 8px; padding: 15px; margin: 25px 0; text-align: center; }
        .confirm-text { font-size: 16px; font-weight: 600; color: #ff4d8d; margin: 0 0 10px; }
        .confirm-text-cn { font-size: 14px; color: #666; margin: 0; font-style: italic; }
        .footer { background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eaeaea; }
        .footer p { margin: 0 0 10px; color: #666; font-size: 14px; }
        .footer p:last-child { margin-bottom: 0; }
        .footer a { color: #ff4d8d; text-decoration: none; }
        .small-text { font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1 style='font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 28px; color: white; margin: 0; padding: 0;'>Naillabo Salon</h1>
        </div>
        <div class='content'>
            <p style='font-size: 16px; color: #333; margin-top: 0;'>Dear $name,</p>
            <p style='font-size: 16px; color: #333; margin-bottom: 25px;'>Thank you for booking with Naillabo Salon. Here are your appointment details:</p>

            <div class='details-box'>
                <div class='details-row'>
                    <div class='icon'>
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='currentColor'><path d='M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z'></path></svg>
                    </div>
                    <div>
                        <p class='label'>Date</p>
                        <p class='value'>$date</p>
                    </div>
                </div>
                <div class='details-row'>
                    <div class='icon'>
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='currentColor'><path d='M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z'></path></svg>
                    </div>
                    <div>
                        <p class='label'>Time</p>
                        <p class='value'>$time</p>
                    </div>
                </div>
                <div class='details-row'>
                    <div class='icon'>
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='currentColor'><path d='M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z'></path></svg>
                    </div>
                    <div>
                        <p class='label'>Services</p>
                        <p class='value'>$services</p>
                    </div>
                </div>
                " . ($message ? "
                <div class='details-row' style='border-top: 1px solid #eaeaea;'>
                    <div class='icon'>
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='currentColor'><path d='M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H6L4,18V4H20'></path></svg>
                    </div>
                    <div>
                        <p class='label'>Special Requests</p>
                        <p class='value'>$message</p>
                    </div>
                </div>" : "") . "
            </div>

            <div class='confirm-box'>
                <p class='confirm-text'>Please reply with the number \"1\" to confirm your appointment</p>
                <p class='confirm-text-cn'>请回复数字\"1\"确认您的预约</p>
            </div>

            <p style='font-size: 16px; color: #333;'>We look forward to serving you!</p>
            <p style='font-size: 16px; color: #333;'>If you have any questions, please contact us at <a href='tel:604.998.7666' style='color: #ff4d8d; text-decoration: none; font-weight: 600;'>604.998.7666</a></p>
            <p style='font-size: 16px; color: #333; font-weight: 600;'>Naillabo Salon Team</p>
        </div>
        <div class='footer'>
            <p>Aberdeen Center, 3530-4151 Hazelbridge Way, Richmond BC</p>
            <p><a href='tel:604.998.7666'>Phone: 604.998.7666</a> | <a href='mailto:naillabo3530@gmail.com'>Email: naillabo3530@gmail.com</a></p>

        </div>
    </div>
</body>
</html>
";

// 尝试发送沙龙通知邮件
$salonMailSent = mail($to, $salonSubject, $salonBody, $salonHeaders);
logMessage("沙龙通知邮件发送" . ($salonMailSent ? "成功" : "失败"));

// 尝试发送客户确认邮件
$customerMailSent = mail($customerEmail, $customerSubject, $customerBody, $customerHeaders);
logMessage("客户确认邮件发送" . ($customerMailSent ? "成功" : "失败"));

// 返回结果
if ($salonMailSent && $customerMailSent) {
    logMessage("所有邮件发送成功");
    echo json_encode(['success' => true, 'message' => '预约成功！确认邮件已发送。']);
} else {
    logMessage("部分或全部邮件发送失败");
    echo json_encode([
        'success' => false,
        'message' => '预约已记录，但邮件发送可能失败。请联系沙龙确认。',
        'salon_mail' => $salonMailSent,
        'customer_mail' => $customerMailSent
    ]);
}
?>
