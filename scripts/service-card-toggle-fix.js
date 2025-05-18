/**
 * Service Card Toggle Fix
 * 
 * This script fixes the issue with service cards not being able to toggle open/closed
 * after they have been closed once.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Find all service card headers
    const serviceCardHeaders = document.querySelectorAll('.service-card-header');

    // Remove any existing click handlers and add new ones
    serviceCardHeaders.forEach(header => {
        const card = header.closest('.service-card');

        // Remove existing click handlers by cloning and replacing the element
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);

        // Add new click handler to the header
        newHeader.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent event bubbling

            // Toggle the active class on the card
            card.classList.toggle('active');

            console.log('Service card toggled:', card.id);
        });

        // Also add click handler to the chevron icon specifically
        const chevron = newHeader.querySelector('.card-toggle');
        if (chevron) {
            chevron.addEventListener('click', function (event) {
                event.stopPropagation(); // Prevent triggering the header's click event

                // Toggle the active class on the card
                card.classList.toggle('active');

                console.log('Chevron clicked, card toggled:', card.id);
            });
        }
    });

    // Make sure service option buttons don't trigger card toggle
    const serviceOptionBtns = document.querySelectorAll('.service-option-btn');
    serviceOptionBtns.forEach(btn => {
        btn.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent event from reaching the card
        });
    });
});
