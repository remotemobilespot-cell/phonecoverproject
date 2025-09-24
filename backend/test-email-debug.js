import sgMail from '@sendgrid/mail';

// Test SendGrid configuration
async function testEmailDebug() {
    try {
        console.log('Testing SendGrid configuration...');
        
        // Check if API key is set
        const apiKey = process.env.SENDGRID_API_KEY;
        console.log('API Key present:', !!apiKey);
        console.log('API Key length:', apiKey ? apiKey.length : 0);
        console.log('API Key starts with SG.:', apiKey ? apiKey.startsWith('SG.') : false);
        
        sgMail.setApiKey(apiKey);
        
        // Test email
        const msg = {
            to: 'r.eshwarkiran@gmail.com',
            from: 'noreply@phonecoverproject.com', // Use verified sender
            subject: 'DEBUG: Email Test from Backend',
            html: `
                <h2>Email Debug Test</h2>
                <p>This is a debug email to test if emails are being sent properly.</p>
                <p>Timestamp: ${new Date().toISOString()}</p>
                <p>If you receive this, the email system is working.</p>
            `
        };
        
        console.log('Sending email to:', msg.to);
        console.log('From:', msg.from);
        
        const result = await sgMail.send(msg);
        console.log('Email sent successfully!');
        console.log('Response:', JSON.stringify(result[0].statusCode));
        
    } catch (error) {
        console.error('Email error:', error);
        if (error.response) {
            console.error('Error body:', error.response.body);
        }
    }
}

testEmailDebug();