/**
 * Dialog utilities for the booking system
 * Provides custom dialog functionality and dialog suppression management
 */

document.addEventListener('DOMContentLoaded', function() {
    // Global function to show custom dialogs
    window.showCustomDialog = function(message) {
        // Check if a dialog already exists and remove it
        const existingDialog = document.querySelector('.custom-validation-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }
        
        // Check if dialogs are suppressed
        const suppressDialogs = localStorage.getItem('suppressValidationDialogs') === 'true';
        if (suppressDialogs) {
            console.log('Dialog suppressed:', message);
            return;
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
        
        // Add event listeners
        const okBtn = dialog.querySelector('.dialog-ok-btn');
        const suppressBtn = dialog.querySelector('.dialog-suppress-btn');
        
        okBtn.addEventListener('click', function() {
            dialog.remove();
        });
        
        suppressBtn.addEventListener('click', function() {
            localStorage.setItem('suppressValidationDialogs', 'true');
            dialog.remove();
            
            // Show a confirmation message that dialogs are suppressed
            const notification = document.createElement('div');
            notification.className = 'dialog-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <p>Dialogs suppressed. To re-enable, clear your browser data or use the developer console.</p>
                    <button type="button" class="btn btn-sm btn-primary notification-close-btn">OK</button>
                </div>
            `;
            
            // Add styles for notification if they don't exist
            if (!document.getElementById('notification-styles')) {
                const notificationStyle = document.createElement('style');
                notificationStyle.id = 'notification-styles';
                notificationStyle.textContent = `
                    .dialog-notification {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background-color: #333;
                        color: white;
                        padding: 10px 15px;
                        border-radius: 4px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                        z-index: 9999;
                        max-width: 300px;
                    }
                    .notification-content {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                    }
                    .notification-content p {
                        margin-bottom: 10px;
                        font-size: 14px;
                    }
                    .btn-sm {
                        padding: 4px 8px;
                        font-size: 12px;
                    }
                `;
                document.head.appendChild(notificationStyle);
            }
            
            // Add notification to body
            document.body.appendChild(notification);
            
            // Add close button event listener
            const closeBtn = notification.querySelector('.notification-close-btn');
            closeBtn.addEventListener('click', function() {
                notification.remove();
            });
            
            // Auto-remove notification after 5 seconds
            setTimeout(function() {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 5000);
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
    };
    
    // Global function to reset dialog suppression
    window.resetDialogSuppression = function() {
        localStorage.removeItem('suppressValidationDialogs');
        console.log('Dialog suppression has been reset. Validation dialogs will now be shown.');
        
        // Show a confirmation message
        const notification = document.createElement('div');
        notification.className = 'dialog-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <p>Dialog suppression has been reset. Validation dialogs will now be shown.</p>
                <button type="button" class="btn btn-sm btn-primary notification-close-btn">OK</button>
            </div>
        `;
        
        // Add notification to body
        document.body.appendChild(notification);
        
        // Add close button event listener
        const closeBtn = notification.querySelector('.notification-close-btn');
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });
        
        // Auto-remove notification after 5 seconds
        setTimeout(function() {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 5000);
    };
    
    // Check if there's a URL parameter to reset dialog suppression
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('reset_dialogs')) {
        window.resetDialogSuppression();
    }
});
