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
            alert('不能选择过去的日期 / Cannot select past dates');
        }
    });
});
