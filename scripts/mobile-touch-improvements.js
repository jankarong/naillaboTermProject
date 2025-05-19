/**
 * Mobile Touch Improvements
 *
 * This script improves touch interactions on mobile devices for the booking interface,
 * focusing on making service options easier to select and improving overall usability.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Function to update the parent card's selected state
    function updateCardSelectedState(optionBtn) {
        const serviceType = optionBtn.dataset.service;
        const card = document.getElementById(`${serviceType}-card`);

        if (card) {
            // Check if any options are selected in this card
            const checkboxes = card.querySelectorAll('input[type="checkbox"]');
            const anySelected = Array.from(checkboxes).some(cb => cb.checked);

            // Update the card's selected state
            if (anySelected) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        }
    }

    // Add visual feedback styles for touch events
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .service-option-btn.touch-active {
            background-color: #fff0f5 !important;
            transform: scale(0.98) !important;
            transition: transform 0.1s ease, background-color 0.1s ease !important;
        }

        @media (max-width: 480px) {
            .service-option-btn {
                -webkit-tap-highlight-color: transparent;
            }
        }
    `;
    document.head.appendChild(styleElement);

    // Detect if we're on a mobile device
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // Improve service option button touch areas for mobile devices
    const serviceOptionBtns = document.querySelectorAll('.service-option-btn');

    if (isMobile) {
        // Remove existing click handlers from service-option-buttons.js to avoid conflicts
        serviceOptionBtns.forEach(btn => {
            // Clone the button to remove all event listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });

        // Re-select all buttons after replacing them
        const refreshedBtns = document.querySelectorAll('.service-option-btn');

        // Add our improved mobile touch handlers
        refreshedBtns.forEach(btn => {
            // Add touchstart event for immediate response
            btn.addEventListener('touchstart', function (e) {
                // Add a visual feedback class
                this.classList.add('touch-active');
            }, { passive: true });

            // Handle touchend to select the option
            btn.addEventListener('touchend', function (e) {
                // Remove visual feedback
                this.classList.remove('touch-active');

                // Find the hidden checkbox
                const checkbox = this.querySelector('.hidden-checkbox');
                if (checkbox) {
                    // Toggle the checkbox
                    checkbox.checked = !checkbox.checked;

                    // Toggle the selected class
                    this.classList.toggle('selected', checkbox.checked);

                    // Handle "Other" option text field
                    if (checkbox.value === 'other') {
                        const serviceType = this.dataset.service;
                        const otherDetailsDiv = document.getElementById(`${serviceType}-other-details`);

                        if (otherDetailsDiv) {
                            otherDetailsDiv.style.display = checkbox.checked ? 'block' : 'none';
                        }
                    }

                    // Update the parent card's selected state
                    updateCardSelectedState(this);

                    // Trigger change event on checkbox to ensure other handlers run
                    const changeEvent = new Event('change', { bubbles: true });
                    checkbox.dispatchEvent(changeEvent);

                    // Prevent default behavior and stop propagation
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            // Also add click handler as fallback
            btn.addEventListener('click', function (e) {
                // Find the hidden checkbox
                const checkbox = this.querySelector('.hidden-checkbox');
                if (checkbox) {
                    // Toggle the checkbox
                    checkbox.checked = !checkbox.checked;

                    // Toggle the selected class
                    this.classList.toggle('selected', checkbox.checked);

                    // Handle "Other" option text field
                    if (checkbox.value === 'other') {
                        const serviceType = this.dataset.service;
                        const otherDetailsDiv = document.getElementById(`${serviceType}-other-details`);

                        if (otherDetailsDiv) {
                            otherDetailsDiv.style.display = checkbox.checked ? 'block' : 'none';
                        }
                    }

                    // Update the parent card's selected state
                    updateCardSelectedState(this);

                    // Trigger change event on checkbox to ensure other handlers run
                    const changeEvent = new Event('change', { bubbles: true });
                    checkbox.dispatchEvent(changeEvent);

                    // Prevent event from reaching the card
                    e.stopPropagation();
                }
            });
        });
    }

    // Improve service card header touch areas
    const serviceCardHeaders = document.querySelectorAll('.service-card-header');

    serviceCardHeaders.forEach(header => {
        header.addEventListener('click', function (e) {
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
        dateInput.addEventListener('touchstart', function (e) {
            // Prevent default to avoid double-tap issues on some devices
            e.preventDefault();
            this.focus();
        });
    }

    if (timeSelect) {
        // Ensure time select is properly focused on mobile
        timeSelect.addEventListener('touchstart', function (e) {
            // Prevent default to avoid double-tap issues on some devices
            e.preventDefault();
            this.focus();
        });
    }

    // Ensure service cards have enough space when expanded
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        const options = card.querySelector('.service-card-options');
        if (options) {
            // Adjust max-height dynamically based on content
            card.addEventListener('transitionend', function (e) {
                if (e.propertyName === 'max-height' && this.classList.contains('active')) {
                    const optionsHeight = options.scrollHeight;
                    options.style.maxHeight = optionsHeight + 'px';
                }
            });
        }
    });
});
