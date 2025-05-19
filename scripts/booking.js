document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
    const appointmentForm = document.getElementById('appointment-form');

    // Debug log
    console.log('Appointment form found:', !!appointmentForm);

    // Add debug event listener to the submit button
    if (appointmentForm) {
        const submitButton = appointmentForm.querySelector('button[type="submit"]');
        if (submitButton) {
            console.log('Submit button found:', !!submitButton);

            // Add direct click handler to ensure form submission
            submitButton.addEventListener('click', function (event) {
                console.log('Submit button clicked in booking.js');

                // Ensure the form is submitted
                if (appointmentForm) {
                    console.log('Triggering form submit event from booking.js');

                    // Explicitly trigger the submit event
                    appointmentForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

                    // Prevent the default button click behavior to avoid double submission
                    event.preventDefault();
                }
            });
        }
    }

    // Debug variables for combo offers
    console.log('Initializing combo offer variables');
    window.comboOfferShown = false;
    window.bareComboOfferShown = false;

    // The date picker functionality is now handled by date-picker.js
    // This is a simpler approach that relies on the HTML5 min attribute

    if (appointmentForm) {
        // Date picker functionality is now handled by date-picker.js

        // Combo offer modal elements
        const comboOfferModal = document.getElementById('combo-offer-modal');
        const closeComboModalBtn = document.querySelector('.close-combo-modal');
        const addPedicureBtn = document.getElementById('add-pedicure-btn');
        const addManicureBtn = document.getElementById('add-manicure-btn');
        const noThanksBtn = document.getElementById('no-thanks-btn');

        // Bare combo offer modal elements
        const bareComboOfferModal = document.getElementById('bare-combo-offer-modal');
        const closeBareComboModalBtn = document.querySelector('.close-bare-combo-modal');
        const addBarePedicureBtn = document.getElementById('add-bare-pedicure-btn');
        const addBareManicureBtn = document.getElementById('add-bare-manicure-btn');
        const noThanksBareBtn = document.getElementById('no-thanks-bare-btn');

        // Flags to track if the combo offers have been shown
        let comboOfferShown = false;
        let bareComboOfferShown = false;

        // Service card interaction
        const serviceCards = document.querySelectorAll('.service-card');

        // Debug log
        console.log('Service cards found:', serviceCards.length);

        if (serviceCards.length > 0) {
            // Ensure all cards are closed initially
            serviceCards.forEach(card => {
                card.classList.remove('active');
                console.log('Service card:', card.id);
            });
            // Handle card header clicks to toggle options
            serviceCards.forEach(card => {
                const cardHeader = card.querySelector('.service-card-header');
                const serviceValue = card.dataset.service;

                // Make the entire card header clickable
                cardHeader.style.cursor = 'pointer';

                // Set up click handler for the card header
                cardHeader.addEventListener('click', function (event) {
                    // Prevent click event from triggering on checkboxes
                    if (event.target.type === 'checkbox' || event.target.tagName === 'LABEL') {
                        return;
                    }

                    // Toggle the active state of this card
                    card.classList.toggle('active');

                    // Update the toggle icon
                    const toggleIcon = cardHeader.querySelector('.card-toggle i');
                    if (toggleIcon) {
                        toggleIcon.style.transform = card.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                    }
                });

                // Prevent clicks in the options area from closing the card
                const optionsArea = card.querySelector('.service-card-options');
                if (optionsArea) {
                    optionsArea.addEventListener('click', function (event) {
                        // Only stop propagation if not clicking on a checkbox or label
                        if (event.target.type !== 'checkbox' && event.target.tagName !== 'LABEL') {
                            event.stopPropagation();
                        }
                    });
                }

                // Set up click handlers for the option checkboxes
                const optionCheckboxes = card.querySelectorAll('input[type="checkbox"]');
                optionCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', function () {
                        // Check if any options are selected
                        const anySelected = Array.from(optionCheckboxes).some(cb => cb.checked);

                        // Handle "Other" option text field
                        if (checkbox.value === 'other') {
                            const serviceType = serviceValue; // 'manicure', 'pedicure', or 'eyelash'
                            const otherDetailsDiv = document.getElementById(`${serviceType}-other-details`);

                            if (otherDetailsDiv) {
                                if (checkbox.checked) {
                                    otherDetailsDiv.style.display = 'block';
                                } else {
                                    otherDetailsDiv.style.display = 'none';
                                }
                            }
                        }

                        // Update the card's selected state based on whether any options are selected
                        if (anySelected) {
                            card.classList.add('selected');

                            // Check if this is a manicure service with single color selected
                            if (serviceValue === 'manicure' && !comboOfferShown && checkbox.value === 'color') {
                                // Check if pedicure is already selected
                                const pedicureCard = document.getElementById('pedicure-card');
                                const isPedicureSelected = pedicureCard && pedicureCard.classList.contains('selected');

                                if (!isPedicureSelected) {
                                    // Show the single color combo offer after a short delay
                                    setTimeout(() => {
                                        // Show "Add Pedicure" button, hide "Add Manicure" button
                                        if (addPedicureBtn) addPedicureBtn.style.display = 'block';
                                        if (addManicureBtn) addManicureBtn.style.display = 'none';

                                        comboOfferModal.classList.add('active');
                                        comboOfferShown = true;
                                    }, 500);
                                }
                            }

                            // Check if this is a pedicure service with single color selected
                            if (serviceValue === 'pedicure' && !comboOfferShown && checkbox.value === 'color') {
                                // Check if manicure is already selected
                                const manicureCard = document.getElementById('manicure-card');
                                const isManicureSelected = manicureCard && manicureCard.classList.contains('selected');

                                if (!isManicureSelected) {
                                    // Show the single color combo offer after a short delay
                                    setTimeout(() => {
                                        // Show "Add Manicure" button, hide "Add Pedicure" button
                                        if (addManicureBtn) addManicureBtn.style.display = 'block';
                                        if (addPedicureBtn) addPedicureBtn.style.display = 'none';

                                        comboOfferModal.classList.add('active');
                                        comboOfferShown = true;
                                    }, 500);
                                }
                            }

                            // Check if this is a bare manicure service
                            if (serviceValue === 'manicure' && !bareComboOfferShown && checkbox.value === 'bare-manicure') {
                                // Check if bare pedicure is already selected
                                const pedicureCard = document.getElementById('pedicure-card');
                                const pedicureBareCheckbox = document.getElementById('pedicure-bare');
                                const isBarePedicureSelected = pedicureCard &&
                                    pedicureCard.classList.contains('selected') &&
                                    pedicureBareCheckbox &&
                                    pedicureBareCheckbox.checked;

                                if (!isBarePedicureSelected) {
                                    // Show the bare combo offer after a short delay
                                    setTimeout(() => {
                                        // Show "Add Bare Pedicure" button, hide "Add Bare Manicure" button
                                        addBarePedicureBtn.style.display = 'block';
                                        addBareManicureBtn.style.display = 'none';

                                        bareComboOfferModal.classList.add('active');
                                        bareComboOfferShown = true;
                                    }, 500);
                                }
                            }

                            // Check if this is a bare pedicure service
                            if (serviceValue === 'pedicure' && !bareComboOfferShown && checkbox.value === 'bare-pedicure') {
                                // Check if bare manicure is already selected
                                const manicureCard = document.getElementById('manicure-card');
                                const manicureBareCheckbox = document.getElementById('manicure-bare');
                                const isBareManicureSelected = manicureCard &&
                                    manicureCard.classList.contains('selected') &&
                                    manicureBareCheckbox &&
                                    manicureBareCheckbox.checked;

                                if (!isBareManicureSelected) {
                                    // Show the bare combo offer after a short delay
                                    setTimeout(() => {
                                        // Show "Add Bare Manicure" button, hide "Add Bare Pedicure" button
                                        addBareManicureBtn.style.display = 'block';
                                        addBarePedicureBtn.style.display = 'none';

                                        bareComboOfferModal.classList.add('active');
                                        bareComboOfferShown = true;
                                    }, 500);
                                }
                            }
                        } else {
                            card.classList.remove('selected');
                        }
                    });
                });
            });

            // Combo offer modal functionality
            if (closeComboModalBtn) {
                closeComboModalBtn.addEventListener('click', function () {
                    comboOfferModal.classList.remove('active');
                });
            }

            if (addPedicureBtn) {
                addPedicureBtn.addEventListener('click', function () {
                    // Find the pedicure card and open it
                    const pedicureCard = document.getElementById('pedicure-card');
                    if (pedicureCard) {
                        // Open the pedicure card
                        pedicureCard.classList.add('active');

                        // Select the single color option
                        const colorOption = document.getElementById('pedicure-color');
                        if (colorOption) {
                            colorOption.checked = true;

                            // Trigger the change event to update the card's selected state
                            const changeEvent = new Event('change');
                            colorOption.dispatchEvent(changeEvent);
                        }

                        // Scroll to the pedicure card
                        pedicureCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    // Close the modal
                    comboOfferModal.classList.remove('active');
                });
            }

            if (addManicureBtn) {
                addManicureBtn.addEventListener('click', function () {
                    // Find the manicure card and open it
                    const manicureCard = document.getElementById('manicure-card');
                    if (manicureCard) {
                        // Open the manicure card
                        manicureCard.classList.add('active');

                        // Select the single color option
                        const colorOption = document.getElementById('manicure-color');
                        if (colorOption) {
                            colorOption.checked = true;

                            // Trigger the change event to update the card's selected state
                            const changeEvent = new Event('change');
                            colorOption.dispatchEvent(changeEvent);
                        }

                        // Scroll to the manicure card
                        manicureCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    // Close the modal
                    comboOfferModal.classList.remove('active');
                });
            }

            if (noThanksBtn) {
                noThanksBtn.addEventListener('click', function () {
                    comboOfferModal.classList.remove('active');
                });
            }

            // Bare Combo offer modal functionality
            if (closeBareComboModalBtn) {
                closeBareComboModalBtn.addEventListener('click', function () {
                    bareComboOfferModal.classList.remove('active');
                });
            }

            if (addBarePedicureBtn) {
                addBarePedicureBtn.addEventListener('click', function () {
                    // Find the pedicure card and open it
                    const pedicureCard = document.getElementById('pedicure-card');
                    if (pedicureCard) {
                        // Open the pedicure card
                        pedicureCard.classList.add('active');

                        // Select the bare pedicure option
                        const barePedicureOption = document.getElementById('pedicure-bare');
                        if (barePedicureOption) {
                            barePedicureOption.checked = true;

                            // Trigger the change event to update the card's selected state
                            const changeEvent = new Event('change');
                            barePedicureOption.dispatchEvent(changeEvent);
                        }

                        // Scroll to the pedicure card
                        pedicureCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    // Close the modal
                    bareComboOfferModal.classList.remove('active');
                });
            }

            if (addBareManicureBtn) {
                addBareManicureBtn.addEventListener('click', function () {
                    // Find the manicure card and open it
                    const manicureCard = document.getElementById('manicure-card');
                    if (manicureCard) {
                        // Open the manicure card
                        manicureCard.classList.add('active');

                        // Select the bare manicure option
                        const bareManicureOption = document.getElementById('manicure-bare');
                        if (bareManicureOption) {
                            bareManicureOption.checked = true;

                            // Trigger the change event to update the card's selected state
                            const changeEvent = new Event('change');
                            bareManicureOption.dispatchEvent(changeEvent);
                        }

                        // Scroll to the manicure card
                        manicureCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    // Close the modal
                    bareComboOfferModal.classList.remove('active');
                });
            }

            if (noThanksBareBtn) {
                noThanksBareBtn.addEventListener('click', function () {
                    bareComboOfferModal.classList.remove('active');
                });
            }
        }

        // Form submission handler - validation only
        appointmentForm.addEventListener('submit', function (event) {
            // Note: The actual form submission is handled by confirmation-modal-fix.js
            // This handler only performs validation

            console.log('Form validation in booking.js');

            try {
                // Basic form validation
                const name = document.getElementById('name')?.value.trim() || '';
                const email = document.getElementById('email')?.value.trim() || '';
                const phone = document.getElementById('phone')?.value.trim() || '';
                const dateInput = document.getElementById('date');
                const date = dateInput?.value || '';
                const time = document.getElementById('time')?.value || '';

                // Get selected service cards (those with at least one option selected)
                const selectedCards = Array.from(document.querySelectorAll('.service-card.selected'));
                const selectedCategories = selectedCards.map(card => card.dataset.service);

                // Debug service selection
                console.log('Selected cards:', selectedCards.length);
                console.log('Selected categories:', selectedCategories);

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

                console.log('Any service selected:', anyServiceSelected);

                // Create a custom dialog function to replace alerts
                function showCustomDialog(message) {
                    // Check if a dialog already exists and remove it
                    const existingDialog = document.querySelector('.custom-validation-dialog');
                    if (existingDialog) {
                        existingDialog.remove();
                    }

                    // Create dialog element
                    const dialog = document.createElement('div');
                    dialog.className = 'custom-validation-dialog';
                    dialog.innerHTML = `
                        <div class="dialog-content">
                            <p>${message}</p>
                            <div class="dialog-buttons">
                                <button type="button" class="btn btn-primary dialog-ok-btn">OK</button>
                                <button type="button" class="btn btn-secondary dialog-suppress-btn">Suppress dialogs</button>
                            </div>
                        </div>
                    `;

                    // Add dialog to body
                    document.body.appendChild(dialog);

                    // Store dialog preference in localStorage
                    const suppressDialogs = localStorage.getItem('suppressValidationDialogs') === 'true';

                    // If dialogs are suppressed, don't show the dialog
                    if (suppressDialogs) {
                        dialog.remove();
                        return;
                    }

                    // Add event listeners
                    const okBtn = dialog.querySelector('.dialog-ok-btn');
                    const suppressBtn = dialog.querySelector('.dialog-suppress-btn');

                    okBtn.addEventListener('click', function () {
                        dialog.remove();
                    });

                    suppressBtn.addEventListener('click', function () {
                        localStorage.setItem('suppressValidationDialogs', 'true');
                        dialog.remove();
                    });

                    // Add styles if they don't exist
                    if (!document.getElementById('custom-dialog-styles')) {
                        const style = document.createElement('style');
                        style.id = 'custom-dialog-styles';
                        style.textContent = `
                            .custom-validation-dialog {
                                position: fixed;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background-color: rgba(0, 0, 0, 0.5);
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                z-index: 10000;
                            }
                            .custom-validation-dialog .dialog-content {
                                background-color: white;
                                padding: 20px;
                                border-radius: 5px;
                                max-width: 90%;
                                width: 400px;
                                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                            }
                            .custom-validation-dialog p {
                                margin-bottom: 15px;
                                font-size: 16px;
                            }
                            .custom-validation-dialog .dialog-buttons {
                                display: flex;
                                justify-content: space-between;
                            }
                            .custom-validation-dialog .btn {
                                padding: 8px 15px;
                                cursor: pointer;
                            }
                        `;
                        document.head.appendChild(style);
                    }
                }

                // Modified validation logic
                if (!name || !email || !phone || !anyServiceSelected || !date || !time) {
                    event.preventDefault(); // Prevent form submission

                    // Show specific error message based on what's missing
                    if (!anyServiceSelected) {
                        showCustomDialog('请至少选择一项服务 / Please select at least one service option');
                    } else {
                        showCustomDialog('请填写所有必填字段 / Please fill in all required fields');
                    }
                    return;
                }

                // Basic date validation - more detailed validation is in date-picker.js
                if (!date) {
                    event.preventDefault(); // Prevent form submission
                    showCustomDialog('请选择预约日期 / Please select an appointment date');
                    return;
                }

                // Function to get a date string in YYYY-MM-DD format
                function getDateString(date) {
                    return date.getFullYear() + '-' +
                        String(date.getMonth() + 1).padStart(2, '0') + '-' +
                        String(date.getDate()).padStart(2, '0');
                }

                // Parse the selected date (browser returns YYYY-MM-DD format)
                const selectedDateParts = date.split('-');
                const year = parseInt(selectedDateParts[0]);
                const month = parseInt(selectedDateParts[1]) - 1; // Months are 0-based in JS
                const day = parseInt(selectedDateParts[2]);

                // Create date objects in local time
                const selectedDate = new Date(year, month, day);
                selectedDate.setHours(0, 0, 0, 0);

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Get string representations for comparison
                const selectedDateStr = getDateString(selectedDate);
                const todayStr = getDateString(today);

                // Only show warning if selected date is BEFORE today
                if (selectedDateStr < todayStr) {
                    event.preventDefault(); // Prevent form submission
                    showCustomDialog('请选择今天或未来的日期 / Please select today or a future date');
                    return;
                }

                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    event.preventDefault(); // Prevent form submission
                    showCustomDialog('Please enter a valid email address');
                    return;
                }

                // Phone validation - basic check for numbers and common separators
                const phoneRegex = /^[0-9\-\+\(\)\s\.]+$/;
                if (!phoneRegex.test(phone)) {
                    event.preventDefault(); // Prevent form submission
                    showCustomDialog('Please enter a valid phone number');
                    return;
                }

                console.log('Form validation passed in booking.js');
                // Let the event continue to be handled by confirmation-modal-fix.js
            } catch (error) {
                // 捕获并处理表单验证过程中的任何错误
                console.error('Error during form validation:', error);
                event.preventDefault(); // 阻止表单提交

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
                        <button type="button" class="btn btn-primary" id="retry-booking-error-btn">重试</button>
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
                    const retryBookingErrorBtn = document.getElementById('retry-booking-error-btn');
                    if (retryBookingErrorBtn) {
                        retryBookingErrorBtn.addEventListener('click', function (event) {
                            event.preventDefault();
                            if (confirm('确定要重新开始预约流程吗？')) {
                                window.location.href = 'book-new.html';
                            }
                        });
                    }
                }, 100);
            }
        });
    }
});
