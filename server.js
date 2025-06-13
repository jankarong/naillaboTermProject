const express = require('express');
const cors = require('cors');
const path = require('path');
const { sendCustomerConfirmationEmail, sendSalonNotificationEmail } = require('./api/send-email');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Test endpoint
app.post('/api/send-email', async (req, res) => {
    try {
        const { name, email, date, time, services, message } = req.body;

        // Send customer confirmation email
        const customerResult = await sendCustomerConfirmationEmail({
            name,
            email,
            date,
            time,
            services,
            message
        });

        // Send salon notification email
        const salonResult = await sendSalonNotificationEmail({
            name,
            email,
            phone: 'Test Phone', // For testing purposes
            date,
            time,
            services,
            message
        });

        res.json({
            success: true,
            customerEmail: customerResult,
            salonEmail: salonResult
        });
    } catch (error) {
        console.error('Error sending test emails:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Add a route for the test page
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'email-test.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Test page available at http://localhost:${port}/test`);
}); 