/**
 * Service Option Buttons
 * 
 * This script handles the interaction with the new service option buttons
 * that replace the traditional checkboxes in the booking form.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find all service option buttons
    const serviceOptionBtns = document.querySelectorAll('.service-option-btn');
    
    // Add click event listeners to each button
    serviceOptionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Find the hidden checkbox inside this button
            const checkbox = this.querySelector('input[type="checkbox"]');
            
            // Toggle the checkbox state
            checkbox.checked = !checkbox.checked;
            
            // Toggle the selected class on the button
            this.classList.toggle('selected', checkbox.checked);
            
            // Trigger the change event on the checkbox to maintain compatibility with existing code
            const changeEvent = new Event('change');
            checkbox.dispatchEvent(changeEvent);
            
            // Handle "Other" option text field
            if (checkbox.value === 'other') {
                const serviceType = this.dataset.service; // 'manicure', 'pedicure', 'eyelash', or 'spa'
                const otherDetailsDiv = document.getElementById(`${serviceType}-other-details`);
                
                if (otherDetailsDiv) {
                    otherDetailsDiv.style.display = checkbox.checked ? 'block' : 'none';
                }
            }
            
            // Update the parent card's selected state
            updateCardSelectedState(this);
        });
    });
    
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
    
    // Initialize button states based on checkbox states (for page refresh or form validation)
    function initButtonStates() {
        serviceOptionBtns.forEach(btn => {
            const checkbox = btn.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                btn.classList.add('selected');
                
                // Handle "Other" option text field
                if (checkbox.value === 'other') {
                    const serviceType = btn.dataset.service;
                    const otherDetailsDiv = document.getElementById(`${serviceType}-other-details`);
                    
                    if (otherDetailsDiv) {
                        otherDetailsDiv.style.display = 'block';
                    }
                }
                
                // Update the parent card's selected state
                updateCardSelectedState(btn);
            }
        });
    }
    
    // Call the initialization function
    initButtonStates();
});
