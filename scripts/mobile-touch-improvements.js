/**
 * Mobile Touch Improvements
 * 
 * This script improves touch interactions on mobile devices for the booking interface,
 * focusing on making service options easier to select and improving overall usability.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Improve service option button touch areas
    const serviceOptionBtns = document.querySelectorAll('.service-option-btn');
    
    serviceOptionBtns.forEach(btn => {
        // Make the entire button area clickable
        btn.addEventListener('click', function(e) {
            // Find the hidden checkbox
            const checkbox = this.querySelector('.hidden-checkbox');
            if (checkbox) {
                // Toggle the checkbox
                checkbox.checked = !checkbox.checked;
                
                // Toggle the selected class
                this.classList.toggle('selected', checkbox.checked);
                
                // Trigger change event on checkbox to ensure other handlers run
                const changeEvent = new Event('change', { bubbles: true });
                checkbox.dispatchEvent(changeEvent);
                
                // Prevent event from reaching the card
                e.stopPropagation();
            }
        });
    });
    
    // Improve service card header touch areas
    const serviceCardHeaders = document.querySelectorAll('.service-card-header');
    
    serviceCardHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            // Find the parent card
            const card = this.closest('.service-card');
            if (card) {
                // Toggle the active class
                card.classList.toggle('active');
                
                // Prevent default behavior
                e.preventDefault();
            }
        });
    });
    
    // Make sure date and time selectors are easy to use on mobile
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    
    if (dateInput) {
        // Ensure date input is properly focused on mobile
        dateInput.addEventListener('touchstart', function(e) {
            // Prevent default to avoid double-tap issues on some devices
            e.preventDefault();
            this.focus();
        });
    }
    
    if (timeSelect) {
        // Ensure time select is properly focused on mobile
        timeSelect.addEventListener('touchstart', function(e) {
            // Prevent default to avoid double-tap issues on some devices
            e.preventDefault();
            this.focus();
        });
    }
    
    // Detect if we're on a mobile device
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    if (isMobile) {
        // Add additional mobile-specific behaviors
        
        // Ensure service cards have enough space when expanded
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            const options = card.querySelector('.service-card-options');
            if (options) {
                // Adjust max-height dynamically based on content
                card.addEventListener('transitionend', function(e) {
                    if (e.propertyName === 'max-height' && this.classList.contains('active')) {
                        const optionsHeight = options.scrollHeight;
                        options.style.maxHeight = optionsHeight + 'px';
                    }
                });
            }
        });
    }
});
