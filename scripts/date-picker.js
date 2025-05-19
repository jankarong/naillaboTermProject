/**
 * Simple date picker implementation to ensure past dates are properly disabled
 * This script handles the date input in the booking form
 */

document.addEventListener('DOMContentLoaded', function () {
    // Get the date input element
    const dateInput = document.getElementById('date');
    if (!dateInput) return;

    // Function to get a date string in YYYY-MM-DD format without time component
    function getDateString(date) {
        return date.getFullYear() + '-' +
            String(date.getMonth() + 1).padStart(2, '0') + '-' +
            String(date.getDate()).padStart(2, '0');
    }

    // Get today's date (using local time to avoid timezone issues)
    const today = new Date();
    // Set to beginning of day in local time
    today.setHours(0, 0, 0, 0);

    // Format today's date as YYYY-MM-DD
    const todayStr = getDateString(today);

    // Set minimum date attribute to today
    dateInput.setAttribute('min', todayStr);

    // Add change event listener to validate selected date
    dateInput.addEventListener('change', function () {
        if (!this.value) return; // Skip validation if no date is selected

        // Parse the selected date (browser returns YYYY-MM-DD format)
        const selectedDateParts = this.value.split('-');
        const year = parseInt(selectedDateParts[0]);
        const month = parseInt(selectedDateParts[1]) - 1; // Months are 0-based in JS
        const day = parseInt(selectedDateParts[2]);

        // Create date object for selected date (in local time)
        const selectedDate = new Date(year, month, day);
        selectedDate.setHours(0, 0, 0, 0);

        // Get string representations for comparison
        const selectedDateStr = getDateString(selectedDate);

        // For debugging
        console.log('Today:', todayStr);
        console.log('Selected:', selectedDateStr);
        console.log('Comparison result:', selectedDateStr < todayStr);

        // Only show warning if selected date is BEFORE today
        // This means the date string is lexicographically less than today's string
        if (selectedDateStr < todayStr) {
            this.value = ''; // Clear the input

            // Check if we should suppress dialogs
            const suppressDialogs = localStorage.getItem('suppressValidationDialogs') === 'true';
            if (!suppressDialogs) {
                // Use custom dialog if available, otherwise fallback to alert
                if (typeof showCustomDialog === 'function') {
                    showCustomDialog('不能选择过去的日期 / Cannot select past dates');
                } else {
                    // Create a simple custom dialog
                    const dialog = document.createElement('div');
                    dialog.className = 'custom-validation-dialog';
                    dialog.innerHTML = `
                        <div class="dialog-content">
                            <p>不能选择过去的日期 / Cannot select past dates</p>
                            <div class="dialog-buttons">
                                <button type="button" class="btn btn-primary dialog-ok-btn">OK</button>
                                <button type="button" class="btn btn-secondary dialog-suppress-btn">Suppress dialogs</button>
                            </div>
                        </div>
                    `;

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

                    // Add dialog to body
                    document.body.appendChild(dialog);

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
                }
            }
        }
    });
});
