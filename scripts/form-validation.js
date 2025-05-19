document.addEventListener('DOMContentLoaded', function () {
    // Get form elements
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const nameInput = document.getElementById('name');

    // Email validation function
    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    // Phone validation function
    function validatePhone(phone) {
        // Remove all non-digit characters to count actual digits
        const digitsOnly = phone.replace(/\D/g, '');

        // Check if the phone has at least 10 digits and at most 15 digits
        if (digitsOnly.length < 10 || digitsOnly.length > 15) {
            return false;
        }

        // Check if the phone contains only valid characters
        const regex = /^[0-9\-\+\(\)\s\.]+$/;
        return regex.test(phone);
    }

    // Function to show validation error
    function showError(input, isValid) {
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');

        if (!isValid) {
            formGroup.classList.add('error');
            input.classList.add('invalid');
            if (errorMessage) {
                errorMessage.style.display = 'block';
            }
        } else {
            formGroup.classList.remove('error');
            input.classList.remove('invalid');
            input.classList.add('valid');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }
    }

    // Add event listeners for real-time validation
    if (emailInput) {
        emailInput.addEventListener('input', function () {
            const isValid = validateEmail(this.value);
            showError(this, isValid || this.value === '');
        });

        emailInput.addEventListener('blur', function () {
            if (this.value !== '') {
                const isValid = validateEmail(this.value);
                showError(this, isValid);
            }
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            const isValid = validatePhone(this.value);
            showError(this, isValid || this.value === '');

            // Format phone number as user types (optional)
            if (this.value.length > 0) {
                // Remove all non-digit characters
                let digits = this.value.replace(/\D/g, '');

                // Format the phone number as user types
                if (digits.length > 0) {
                    // Format for North American numbers (XXX-XXX-XXXX)
                    if (digits.length <= 3) {
                        // Do nothing, just keep the digits
                    } else if (digits.length <= 6) {
                        digits = digits.slice(0, 3) + '-' + digits.slice(3);
                    } else {
                        digits = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6, 10);
                    }

                    // Only update if the format is different to avoid cursor jumping
                    if (digits !== this.value) {
                        // Store cursor position
                        const start = this.selectionStart;
                        const end = this.selectionEnd;
                        const oldLength = this.value.length;

                        this.value = digits;

                        // Adjust cursor position if needed
                        const newLength = this.value.length;
                        const diff = newLength - oldLength;

                        this.setSelectionRange(start + diff, end + diff);
                    }
                }
            }
        });

        phoneInput.addEventListener('blur', function () {
            if (this.value !== '') {
                const isValid = validatePhone(this.value);
                showError(this, isValid);
            }
        });
    }

    // Add validation for the name field
    if (nameInput) {
        nameInput.addEventListener('blur', function () {
            const isValid = this.value.trim().length > 0;
            showError(this, isValid);
        });
    }

    // Add form submit validation
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        // This is just an additional validation layer
        // The main validation is still handled in booking.js
        appointmentForm.addEventListener('submit', function (event) {
            let isValid = true;

            // Validate email
            if (emailInput && emailInput.value) {
                const emailValid = validateEmail(emailInput.value);
                showError(emailInput, emailValid);
                isValid = isValid && emailValid;
            }

            // Validate phone
            if (phoneInput && phoneInput.value) {
                const phoneValid = validatePhone(phoneInput.value);
                showError(phoneInput, phoneValid);
                isValid = isValid && phoneValid;
            }

            // If any validation fails, prevent form submission
            if (!isValid) {
                event.preventDefault();

                // Show a custom dialog if available
                if (typeof showCustomDialog === 'function') {
                    showCustomDialog('Please correct the highlighted fields before submitting.');
                }

                // Scroll to the first error
                const firstError = document.querySelector('.form-group.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }
});
