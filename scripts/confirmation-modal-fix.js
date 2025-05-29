// Fix for booking confirmation modal
document.addEventListener('DOMContentLoaded', function () {
    console.log('Confirmation modal fix script loaded');

    // Get the confirmation modal
    const confirmationModal = document.getElementById('booking-confirmation-modal');
    if (!confirmationModal) {
        console.error('Confirmation modal not found');
        return;
    }

    console.log('Confirmation modal found:', confirmationModal);

    // Get the buttons
    const confirmButton = document.getElementById('confirm-booking-btn');
    const editButton = document.getElementById('edit-booking-btn');

    console.log('Confirm button found:', !!confirmButton);
    console.log('Edit button found:', !!editButton);

    // Add direct click handlers to the buttons
    if (confirmButton) {
        // Remove any existing click handlers and replace with a new button
        const newConfirmButton = confirmButton.cloneNode(true);
        confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);

        // Add a new click handler to the new button
        newConfirmButton.addEventListener('click', function (event) {
            console.log('Confirm button clicked - processing booking');

            // 阻止默认行为，避免自动跳转
            event.preventDefault();

            // Hide the modal
            confirmationModal.classList.remove('active');
            confirmationModal.style.display = 'none';
            confirmationModal.style.opacity = '0';
            confirmationModal.style.visibility = 'hidden';

            // Get the appointment form
            const appointmentForm = document.getElementById('appointment-form');
            if (appointmentForm) {
                console.log('Processing form submission');

                // Format services for display and for email
                let servicesHtml = '';
                let servicesText = '';
                const selectedCards = Array.from(document.querySelectorAll('.service-card.selected'));
                selectedCards.forEach(card => {
                    const serviceType = card.dataset.service;
                    const serviceLabel = card.querySelector('.service-card-title span').textContent;

                    // Get selected options
                    const options = Array.from(
                        card.querySelectorAll(`input[name="${serviceType}-options[]"]:checked`)
                    ).map(checkbox => {
                        const label = document.querySelector(`label[for="${checkbox.id}"]`);
                        let optionText = label ? label.textContent.trim() : checkbox.value;

                        // Check if this is the "other" option and get the text input value
                        if (checkbox.value === 'other') {
                            const otherInput = document.querySelector(`input[name="${serviceType}-other-text"]`);
                            if (otherInput && otherInput.value.trim()) {
                                optionText += `: ${otherInput.value.trim()}`;
                            }
                        }

                        return optionText;
                    });

                    servicesHtml += `<li><strong>${serviceLabel}:</strong><span>${options.join(', ')}</span></li>`;
                    servicesText += `${serviceLabel}: ${options.join(', ')}; `;
                });

                // Get date and time in a more readable format
                // Fix timezone issue by parsing date correctly
                const dateValue = document.getElementById('date').value; // Format: YYYY-MM-DD
                const [year, month, day] = dateValue.split('-').map(num => parseInt(num));
                // Create date object in local timezone (avoid UTC interpretation)
                const dateObj = new Date(year, month - 1, day); // month is 0-based
                const formattedDate = dateObj.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                });

                // Collect "Other" option details for email
                let otherDetailsForEmail = '';
                document.querySelectorAll('.service-card.selected').forEach(card => {
                    const serviceType = card.dataset.service;
                    const otherCheckbox = card.querySelector(`input[name="${serviceType}-options[]"][value="other"]:checked`);
                    if (otherCheckbox) {
                        const otherInput = document.querySelector(`input[name="${serviceType}-other-text"]`);
                        if (otherInput && otherInput.value.trim()) {
                            otherDetailsForEmail += `${serviceType} other: ${otherInput.value.trim()}\n`;
                        }
                    }
                });

                // Format the email content with clear sections and highlighting
                const emailContent = `
==============================================
📅 NEW BOOKING REQUEST / 新预约请求 📅
==============================================

👤 CUSTOMER INFORMATION / 客户信息:
------------------------------------------
Name / 姓名: ${document.getElementById('name').value.trim()}
Email / 电子邮箱: ${document.getElementById('email').value.trim()}
Phone / 电话: ${document.getElementById('phone').value.trim()}

📆 APPOINTMENT DETAILS / 预约详情:
------------------------------------------
Date / 日期: ${formattedDate}
Time / 时间: ${document.getElementById('time').value}

💅 SELECTED SERVICES / 所选服务:
------------------------------------------
${servicesText.replace(/;/g, '\n')}
${otherDetailsForEmail ? `\n🔍 OTHER DETAILS / 其他详情:\n------------------------------------------\n${otherDetailsForEmail}` : ''}

${document.getElementById('message').value.trim() ?
                        `📝 SPECIAL REQUESTS / 特殊要求:
------------------------------------------
${document.getElementById('message').value.trim()}
` : ''}

==============================================
`;

                // Create a hidden input to store the formatted email content
                const emailContentInput = document.createElement('input');
                emailContentInput.type = 'hidden';
                emailContentInput.name = 'email_content';
                emailContentInput.value = emailContent;
                appointmentForm.appendChild(emailContentInput);

                // Create individual hidden inputs for each piece of information
                const nameInput = document.createElement('input');
                nameInput.type = 'hidden';
                nameInput.name = 'Customer_Name';
                nameInput.value = document.getElementById('name').value.trim();
                appointmentForm.appendChild(nameInput);

                const dateInput = document.createElement('input');
                dateInput.type = 'hidden';
                dateInput.name = 'Appointment_Date';
                dateInput.value = formattedDate;
                appointmentForm.appendChild(dateInput);

                const timeInput = document.createElement('input');
                timeInput.type = 'hidden';
                timeInput.name = 'Appointment_Time';
                timeInput.value = document.getElementById('time').value;
                appointmentForm.appendChild(timeInput);

                // Create a hidden input to store all selected services
                const servicesInput = document.createElement('input');
                servicesInput.type = 'hidden';
                servicesInput.name = 'Selected_Services';
                servicesInput.value = servicesText;
                appointmentForm.appendChild(servicesInput);

                // 不再使用FormSubmit的重定向功能，避免自动刷新页面
                // const redirectInput = document.createElement('input');
                // redirectInput.type = 'hidden';
                // redirectInput.name = '_next';
                // redirectInput.value = window.location.href;
                // appointmentForm.appendChild(redirectInput);

                // Add a hidden input for FormSubmit subject line
                const subjectInput = document.createElement('input');
                subjectInput.type = 'hidden';
                subjectInput.name = '_subject';
                subjectInput.value = `Booking: ${document.getElementById('name').value.trim()} - ${formattedDate} ${document.getElementById('time').value}`;
                appointmentForm.appendChild(subjectInput);

                // Add a hidden input to use template
                const templateInput = document.createElement('input');
                templateInput.type = 'hidden';
                templateInput.name = '_template';
                templateInput.value = 'box';
                appointmentForm.appendChild(templateInput);

                // Store the original form HTML to restore after submission
                const originalFormHtml = appointmentForm.innerHTML;

                // Add a hidden field to detect if this is the first submission to FormSubmit
                const honeypotInput = document.createElement('input');
                honeypotInput.type = 'hidden';
                honeypotInput.name = '_formsubmit_id';
                honeypotInput.value = 'naillabo-booking-form';
                appointmentForm.appendChild(honeypotInput);

                // Create a backup of the form data for our success message
                const formDataBackup = {
                    name: document.getElementById('name').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    date: formattedDate,
                    time: document.getElementById('time').value,
                    servicesHtml: servicesHtml
                };

                // Add a message about email confirmation
                const emailNote = document.createElement('div');
                emailNote.className = 'email-note';
                emailNote.innerHTML = `
                    <p style="color: #0066cc; font-weight: bold; margin-top: 15px; padding: 10px; border: 1px dashed #0066cc; border-radius: 5px;">
                        <i class="fas fa-info-circle"></i> 提交表单后，系统将直接从naillabo3530@gmail.com向您发送确认邮件。请查收并回复数字"1"确认您的预约。
                        <br><br>
                        <i class="fas fa-info-circle"></i> After submitting the form, the system will send a confirmation email directly from naillabo3530@gmail.com. Please check your inbox and reply with "1" to confirm your appointment.
                    </p>
                `;
                appointmentForm.appendChild(emailNote);

                // Process the form submission
                console.log('Processing form submission');

                // 阻止表单默认提交行为，避免自动跳转
                event.preventDefault();

                // Show success message immediately
                // We'll show the success message first, then process the email sending
                const successMessage = document.createElement('div');
                successMessage.className = 'booking-success compact';
                successMessage.innerHTML = `
                    <div class="success-header">
                        <img src="images/logo.png" alt="Naillabo Logo" class="success-logo">
                        <h2>Thank you for your appointment</h2>
                    </div>
                    <div class="success-content">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="success-message">
                            <p><strong>Your appointment has been submitted.</strong> <span style="color: #ff4d8d; font-weight: bold;">Please check your email and phone to confirm.</span></p>
                            <p><strong>您的预约已提交。</strong><span style="color: #ff4d8d; font-weight: bold;">请留意邮箱和电话确认预约。</span></p>
                        </div>
                        <div class="appointment-details">
                            <h3>Appointment Details</h3>
                            <div class="appointment-summary">
                                <ul class="service-list compact-list">
                                    ${formDataBackup.servicesHtml}
                                </ul>
                            </div>
                        </div>
                        <div class="contact-info">
                            <p class="urgent-note"><i class="fas fa-phone-alt"></i> For urgent appointment, please call us at <a href="tel:604.998.7666">604.998.7666</a></p>
                        </div>
                        <div class="action-buttons">
                            <button type="button" class="btn btn-primary" id="book-another-appointment-btn">Book Another Appointment</button>
                        </div>
                    </div>
                `;

                // 不再使用隐藏iframe提交表单，避免自动跳转
                // const hiddenIframe = document.createElement('iframe');
                // hiddenIframe.name = 'hidden-form-iframe';
                // hiddenIframe.style.display = 'none';
                // document.body.appendChild(hiddenIframe);

                // 不再设置表单target
                // appointmentForm.target = 'hidden-form-iframe';

                // Replace the form with success message immediately
                appointmentForm.innerHTML = '';
                appointmentForm.appendChild(successMessage);
                appointmentForm.scrollIntoView({ behavior: 'smooth' });

                // 添加"Book Another Appointment"按钮的点击事件
                setTimeout(() => {
                    const bookAnotherAppointmentBtn = document.getElementById('book-another-appointment-btn');
                    if (bookAnotherAppointmentBtn) {
                        bookAnotherAppointmentBtn.addEventListener('click', function (event) {
                            event.preventDefault();
                            if (confirm('确定要预约其他服务吗？当前预约已成功提交。\nAre you sure you want to book another appointment? Your current booking has been submitted.')) {
                                window.location.href = 'book-new.html';
                            }
                        });
                    }
                }, 500);

                // Process the email sending in the background
                setTimeout(function () {
                    // Create a hidden container for processing
                    const hiddenContainer = document.createElement('div');
                    hiddenContainer.style.display = 'none';

                    // Collect "Other" option details
                    let otherDetails = '';
                    document.querySelectorAll('.service-card.selected').forEach(card => {
                        const serviceType = card.dataset.service;
                        const otherCheckbox = card.querySelector(`input[name="${serviceType}-options[]"][value="other"]:checked`);
                        if (otherCheckbox) {
                            const otherInput = document.querySelector(`input[name="${serviceType}-other-text"]`);
                            if (otherInput && otherInput.value.trim()) {
                                otherDetails += `${serviceType} other: ${otherInput.value.trim()}; `;
                            }
                        }
                    });

                    // Prepare the data for email sending
                    const emailData = {
                        name: formDataBackup.name,
                        email: formDataBackup.email,
                        phone: formDataBackup.phone,
                        date: formDataBackup.date,
                        time: formDataBackup.time,
                        services: servicesText,
                        message: document.getElementById('message') ? document.getElementById('message').value.trim() : '',
                        otherDetails: otherDetails.trim()
                    };

                    // 使用Gmail应用专用密码通过Vercel API发送邮件
                    try {
                        // 收集预约数据
                        const emailData = {
                            name: formDataBackup.name,
                            email: formDataBackup.email,
                            phone: formDataBackup.phone,
                            date: formDataBackup.date,
                            time: formDataBackup.time,
                            services: servicesText,
                            message: document.getElementById('message') ? document.getElementById('message').value.trim() : ''
                        };

                        // 检测是否在本地环境
                        const isLocalhost = window.location.hostname === 'localhost' ||
                            window.location.hostname === '127.0.0.1' ||
                            window.location.hostname.includes('192.168.') ||
                            window.location.protocol === 'file:';

                        // 发送确认邮件
                        if (typeof sendBookingEmail === 'function') {
                            console.log('Sending email using Gmail app password via Vercel API');

                            // 即使在本地环境中也实际发送邮件
                            if (isLocalhost) {
                                console.log('本地环境检测：实际发送邮件');

                                // 不再添加本地环境邮件发送提示框

                                // 实际发送邮件
                                sendBookingEmail(emailData)
                                    .then(success => {
                                        if (success) {
                                            console.log('本地环境：邮件发送成功');

                                            // 不再更新提示框
                                        } else {
                                            console.error('本地环境：邮件发送失败');

                                            // 不再更新提示框
                                        }
                                    })
                                    .catch(error => {
                                        console.error('本地环境：邮件发送错误', error);

                                        // 不再更新提示框
                                    });
                            } else {
                                // 正常环境，实际发送邮件
                                sendBookingEmail(emailData)
                                    .then(success => {
                                        if (success) {
                                            console.log('Email sent successfully to customer and salon');

                                            // 不再添加绿色邮件发送成功提示框
                                        } else {
                                            console.error('Failed to send email to customer');

                                            // 不再添加邮件发送失败提示框
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error sending email:', error);
                                    });
                            }
                        } else {
                            console.warn('sendBookingEmail function not found - api-handler.js may not be loaded');
                        }
                    } catch (error) {
                        console.error('Error in email sending process:', error);
                    }

                    // Clean up
                    setTimeout(() => {
                        if (document.body.contains(hiddenContainer)) {
                            document.body.removeChild(hiddenContainer);
                        }
                    }, 1000);
                }, 100);
            }
        });
    }

    if (editButton) {
        // Remove any existing click handlers
        const newEditButton = editButton.cloneNode(true);
        editButton.parentNode.replaceChild(newEditButton, editButton);

        newEditButton.addEventListener('click', function () {
            console.log('Edit button clicked - returning to form');

            // Hide the modal
            confirmationModal.classList.remove('active');
            confirmationModal.style.display = 'none';
            confirmationModal.style.opacity = '0';
            confirmationModal.style.visibility = 'hidden';

            // Re-enable the submit button
            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-calendar-check"></i> Book Appointment';
            }
        });
    }

    // Add a global function to show the modal for testing
    window.showConfirmationModal = function () {
        console.log('Showing confirmation modal via test function');

        // Populate with test data
        document.getElementById('confirm-name').textContent = 'Test User';
        document.getElementById('confirm-email').textContent = 'test@example.com';
        document.getElementById('confirm-phone').textContent = '123-456-7890';
        document.getElementById('confirm-date').textContent = '2023-12-31';
        document.getElementById('confirm-time').textContent = '14:00';
        document.getElementById('confirm-services').innerHTML = '<li><strong>Manicure:</strong> Single color</li>';

        // Show the modal
        confirmationModal.style.display = 'flex';
        confirmationModal.style.opacity = '1';
        confirmationModal.style.visibility = 'visible';
        confirmationModal.style.zIndex = '10000';
        confirmationModal.classList.add('active');

        console.log('Modal should be visible now');
    };

    // No debug button needed in production

    // Get the appointment form
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        console.log('Appointment form found, adding submit event listener');

        // Add a submit event listener to the form
        appointmentForm.addEventListener('submit', function (event) {
            console.log('Form submit event captured by confirmation-modal-fix.js');

            // Prevent the default form submission
            event.preventDefault();

            try {
                // Get form data - using optional chaining to prevent null errors
                const name = document.getElementById('name')?.value.trim() || '';
                const email = document.getElementById('email')?.value.trim() || '';
                const phone = document.getElementById('phone')?.value.trim() || '';
                const date = document.getElementById('date')?.value || '';
                const time = document.getElementById('time')?.value || '';

                // Basic validation
                if (!name || !email || !phone || !date || !time) {
                    console.log('Form validation failed');
                    return; // Let the original validation handle this
                }

                // Get selected services
                const selectedCards = Array.from(document.querySelectorAll('.service-card.selected'));

                // Check if any service options are selected
                let anyServiceSelected = false;

                // Check each service card for selected options
                document.querySelectorAll('.service-card').forEach(card => {
                    const serviceType = card.dataset.service;
                    const checkboxes = card.querySelectorAll(`input[name="${serviceType}-options[]"]:checked`);
                    if (checkboxes.length > 0) {
                        anyServiceSelected = true;
                        // Make sure the card is marked as selected
                        card.classList.add('selected');
                    }
                });

                console.log('Any service selected in confirmation-modal-fix.js:', anyServiceSelected);

                if (!anyServiceSelected) {
                    console.log('No services selected');
                    return; // Let the original validation handle this
                }

                // Format services for display
                let servicesHtml = '';
                selectedCards.forEach(card => {
                    const serviceType = card.dataset.service;
                    const serviceLabel = card.querySelector('.service-card-title span').textContent;

                    // Get selected options
                    const options = Array.from(
                        card.querySelectorAll(`input[name="${serviceType}-options[]"]:checked`)
                    ).map(checkbox => {
                        const label = document.querySelector(`label[for="${checkbox.id}"]`);
                        let optionText = label ? label.textContent.trim() : checkbox.value;

                        // Check if this is the "other" option and get the text input value
                        if (checkbox.value === 'other') {
                            const otherInput = document.querySelector(`input[name="${serviceType}-other-text"]`);
                            if (otherInput && otherInput.value.trim()) {
                                optionText += `: ${otherInput.value.trim()}`;
                            }
                        }

                        return optionText;
                    });

                    servicesHtml += `<li><strong>${serviceLabel}:</strong><span>${options.join(', ')}</span></li>`;
                });

                // Populate the confirmation modal
                document.getElementById('confirm-name').textContent = name;
                document.getElementById('confirm-email').textContent = email;
                document.getElementById('confirm-phone').textContent = phone;
                document.getElementById('confirm-date').textContent = date;
                document.getElementById('confirm-time').textContent = time;
                document.getElementById('confirm-services').innerHTML = servicesHtml;

                // Handle message if present
                const message = document.getElementById('message').value.trim();
                const messageContainer = document.getElementById('confirm-message-container');
                const messageSpan = document.getElementById('confirm-message');

                if (message) {
                    messageSpan.textContent = message;
                    messageContainer.style.display = 'block';
                } else {
                    messageContainer.style.display = 'none';
                }

                console.log('Showing confirmation modal');

                // Show the modal with both inline styles and class
                confirmationModal.style.display = 'flex';
                confirmationModal.style.opacity = '1';
                confirmationModal.style.visibility = 'visible';
                confirmationModal.style.zIndex = '10000';
                confirmationModal.classList.add('active');

                // Disable the submit button
                const submitButton = appointmentForm.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                }

                // Debug the modal state
                setTimeout(() => {
                    const computedStyle = window.getComputedStyle(confirmationModal);
                    console.log('Modal computed style:', {
                        display: computedStyle.display,
                        opacity: computedStyle.opacity,
                        visibility: computedStyle.visibility,
                        zIndex: computedStyle.zIndex
                    });
                }, 100);
            } catch (error) {
                // 捕获并处理表单处理过程中的任何错误
                console.error('Error in confirmation modal processing:', error);

                // 重新启用提交按钮
                const submitButton = appointmentForm.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="fas fa-calendar-check"></i> Book Appointment';
                }

                // 显示错误消息
                const errorMessage = document.createElement('div');
                errorMessage.className = 'booking-result error';
                errorMessage.innerHTML = `
                    <div class="result-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <h3>预约提交失败</h3>
                    <p>发生错误: ${error.message || '表单数据处理错误'}</p>
                    <p>请稍后再试或直接联系我们：604.998.7666</p>
                    <div class="result-actions">
                        <button type="button" class="btn btn-primary" id="retry-form-btn">重试</button>
                    </div>
                `;

                // 替换表单内容或添加到页面
                const formContainer = document.querySelector('.booking-form-container');
                if (formContainer) {
                    formContainer.innerHTML = '';
                    formContainer.appendChild(errorMessage);
                    formContainer.scrollIntoView({ behavior: 'smooth' });
                } else {
                    appointmentForm.innerHTML = '';
                    appointmentForm.appendChild(errorMessage);
                    appointmentForm.scrollIntoView({ behavior: 'smooth' });
                }

                // 添加重试按钮的点击事件
                setTimeout(() => {
                    const retryFormBtn = document.getElementById('retry-form-btn');
                    if (retryFormBtn) {
                        retryFormBtn.addEventListener('click', function (event) {
                            event.preventDefault();
                            if (confirm('确定要重新开始预约流程吗？')) {
                                window.location.href = 'book-new.html';
                            }
                        });
                    }
                }, 100);
            }
        }, true); // Use capturing to ensure this runs before the original handler
    } else {
        console.error('Appointment form not found');
    }
});
