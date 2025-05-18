/**
 * 预约表单API处理脚本
 * 用于将预约表单数据发送到Vercel API端点
 */

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    console.log('Booking API script loaded');

    // 获取预约表单
    const appointmentForm = document.getElementById('appointment-form');
    if (!appointmentForm) {
        console.error('Appointment form not found');
        return;
    }

    // 获取确认按钮
    const confirmButton = document.getElementById('confirm-booking-btn');
    if (!confirmButton) {
        console.error('Confirm booking button not found');
        return;
    }

    // 添加确认按钮点击事件
    confirmButton.addEventListener('click', async function (event) {
        event.preventDefault();
        console.log('Confirm button clicked - processing booking via API');

        // 获取确认模态框
        const confirmationModal = document.getElementById('booking-confirmation-modal');
        if (confirmationModal) {
            // 隐藏确认模态框
            confirmationModal.classList.remove('active');
            confirmationModal.style.display = 'none';
        }

        // 禁用确认按钮，防止重复提交
        confirmButton.disabled = true;
        confirmButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';

        try {
            // 收集表单数据
            const formData = collectFormData();
            console.log('Collected form data:', formData);

            // 显示处理中的消息
            showProcessingMessage();

            // 发送数据到API端点
            const response = await sendBookingData(formData);
            console.log('API response:', response);

            // 处理响应
            if (response.success) {
                // 显示成功消息
                showSuccessMessage();
            } else {
                // 显示错误消息
                showErrorMessage(response.message || '预约提交失败，请稍后再试。');
                // 重新启用确认按钮
                confirmButton.disabled = false;
                confirmButton.innerHTML = '确认预约';
            }
        } catch (error) {
            console.error('Error processing booking:', error);
            // 显示错误消息
            showErrorMessage('发生错误: ' + error.message);
            // 重新启用确认按钮
            confirmButton.disabled = false;
            confirmButton.innerHTML = '确认预约';
        }
    });

    /**
     * 收集表单数据
     * @returns {Object} 表单数据对象
     */
    function collectFormData() {
        try {
            // 基本信息 - 使用可选链和默认值防止null错误
            const name = document.getElementById('name')?.value?.trim() || '';
            const email = document.getElementById('email')?.value?.trim() || '';
            const phone = document.getElementById('phone')?.value?.trim() || '';
            const date = document.getElementById('date')?.value || '';
            const time = document.getElementById('time')?.value || '';
            const message = document.getElementById('message')?.value?.trim() || '';

            // 收集服务信息
            let servicesText = '';
            const selectedCards = Array.from(document.querySelectorAll('.service-card.selected') || []);

            selectedCards.forEach(card => {
                if (!card) return; // 跳过null或undefined的卡片

                const serviceType = card.dataset?.service || '';
                const serviceTitleSpan = card.querySelector('.service-card-title span');
                const serviceLabel = serviceTitleSpan?.textContent || '未知服务';

                // 获取选中的选项
                const checkboxes = card.querySelectorAll(`input[name="${serviceType}-options[]"]:checked`);
                if (!checkboxes || checkboxes.length === 0) return;

                const options = Array.from(checkboxes).map(checkbox => {
                    if (!checkbox || !checkbox.parentElement) return '未知选项';

                    const optionLabelElement = checkbox.parentElement.querySelector('.option-label');
                    const optionLabel = optionLabelElement?.textContent || '未知选项';
                    let optionText = optionLabel;

                    // 检查是否是"其他"选项，并获取文本输入值
                    if (checkbox.value === 'other') {
                        const otherInput = document.querySelector(`input[name="${serviceType}-other-text"]`);
                        if (otherInput && otherInput.value?.trim()) {
                            optionText += `: ${otherInput.value.trim()}`;
                        }
                    }

                    return optionText;
                }).filter(text => text); // 过滤掉空值

                if (options.length > 0) {
                    servicesText += `${serviceLabel}: ${options.join(', ')}\n`;
                }
            });

            return {
                name,
                email,
                phone,
                date,
                time,
                services: servicesText,
                message
            };
        } catch (error) {
            console.error('Error collecting form data:', error);
            // 返回一个带有错误信息的对象，以便在UI中显示
            throw new Error('表单数据收集失败: ' + error.message);
        }

        /**
         * 发送预约数据到API端点
         * @param {Object} data 预约数据
         * @returns {Promise<Object>} API响应
         */
        async function sendBookingData(data) {
            try {
                // 构建API URL（相对路径）
                const apiUrl = '/api/send-email';

                // 发送POST请求
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                // 解析响应
                const result = await response.json();

                // 如果响应不成功，抛出错误
                if (!response.ok) {
                    throw new Error(result.message || '服务器错误');
                }

                return result;
            } catch (error) {
                console.error('API request failed:', error);
                throw error;
            }
        }

        /**
         * 显示处理中的消息
         */
        function showProcessingMessage() {
            try {
                const appointmentForm = document.getElementById('appointment-form');
                if (!appointmentForm) {
                    console.error('Appointment form not found when showing processing message');
                    return;
                }

                // 创建处理中的消息元素
                const processingMessage = document.createElement('div');
                processingMessage.id = 'processing-message';
                processingMessage.className = 'booking-result processing';
                processingMessage.innerHTML = `
                <div class="result-icon">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <h3>处理您的预约...</h3>
                <p>请稍候，我们正在处理您的预约请求。</p>
                `;

                // 替换表单内容
                appointmentForm.innerHTML = '';
                appointmentForm.appendChild(processingMessage);
                appointmentForm.scrollIntoView({ behavior: 'smooth' });
            } catch (error) {
                console.error('Error showing processing message:', error);
                // 如果显示处理消息失败，尝试显示一个简单的警告
                alert('处理您的预约请求中...');
            }
        }

        /**
         * 显示成功消息
         */
        function showSuccessMessage() {
            try {
                const appointmentForm = document.getElementById('appointment-form');
                if (!appointmentForm) {
                    console.error('Appointment form not found when showing success message');
                    return;
                }

                // 创建成功消息元素
                const successMessage = document.createElement('div');
                successMessage.id = 'success-message';
                successMessage.className = 'booking-result success';
                successMessage.innerHTML = `
                <div class="result-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>预约已提交</h3>
                <p>请留意邮箱和电话确认预约。</p>
                <div class="result-actions">
                    <button type="button" class="btn btn-primary" id="book-another-btn">预约其他服务</button>
                </div>
                `;

                // 替换表单内容
                appointmentForm.innerHTML = '';
                appointmentForm.appendChild(successMessage);
                appointmentForm.scrollIntoView({ behavior: 'smooth' });

                // 添加"预约其他服务"按钮的点击事件
                const bookAnotherBtn = document.getElementById('book-another-btn');
                if (bookAnotherBtn) {
                    bookAnotherBtn.addEventListener('click', function (event) {
                        event.preventDefault();
                        if (confirm('确定要预约其他服务吗？当前预约已成功提交。')) {
                            window.location.href = 'book-new.html';
                        }
                    });
                }
            } catch (error) {
                console.error('Error showing success message:', error);
                // 如果显示成功消息失败，尝试显示一个简单的警告
                alert('预约已提交！请查看您的邮箱并回复数字"1"确认预约。');
            }
        }

        /**
         * 显示错误消息
         * @param {string} errorMessage 错误信息
         */
        function showErrorMessage(errorMessage) {
            try {
                const appointmentForm = document.getElementById('appointment-form');
                if (!appointmentForm) {
                    console.error('Appointment form not found when showing error message');
                    // 如果找不到表单，直接显示警告
                    alert('预约提交失败: ' + errorMessage);
                    return;
                }

                // 检查是否是特定的错误类型
                let errorTitle = '预约提交失败';
                let errorDetails = errorMessage || '未知错误';

                // 处理特定的错误类型
                if (errorMessage && (
                    errorMessage.includes('Cannot read properties of null') ||
                    errorMessage.includes("reading 'value'") ||
                    errorMessage.includes('表单数据收集失败')
                )) {
                    errorTitle = '预约提交失败';
                    errorDetails = '表单数据处理错误，请确保所有必填字段已正确填写。';
                }

                // 创建错误消息元素
                const errorElement = document.createElement('div');
                errorElement.id = 'error-message';
                errorElement.className = 'booking-result error';
                errorElement.innerHTML = `
                <div class="result-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h3>${errorTitle}</h3>
                <p>${errorDetails}</p>
                <p>请稍后再试或直接联系我们：604.998.7666</p>
                <div class="result-actions">
                    <button type="button" class="btn btn-primary" id="retry-booking-btn">重试</button>
                </div>
                `;

                // 替换处理中的消息（如果存在）
                const processingMessage = document.getElementById('processing-message');
                if (processingMessage) {
                    processingMessage.replaceWith(errorElement);
                } else {
                    // 否则添加到表单
                    appointmentForm.innerHTML = '';
                    appointmentForm.appendChild(errorElement);
                }

                appointmentForm.scrollIntoView({ behavior: 'smooth' });

                // 添加重试按钮的点击事件
                setTimeout(() => {
                    const retryBookingBtn = document.getElementById('retry-booking-btn');
                    if (retryBookingBtn) {
                        retryBookingBtn.addEventListener('click', function (event) {
                            event.preventDefault();
                            if (confirm('确定要重新开始预约流程吗？')) {
                                window.location.href = 'book-new.html';
                            }
                        });
                    }
                }, 100);
            } catch (error) {
                console.error('Error showing error message:', error);
                // 如果显示错误消息失败，尝试显示一个简单的警告
                alert('预约提交失败: ' + (errorMessage || '未知错误'));
            }
        }
    });
