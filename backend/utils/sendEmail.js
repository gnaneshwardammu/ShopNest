const nodeMailer = require('nodemailer');

const sendEmail = async (optionsOrTo, subject, text) => { 
    try {
        const options = typeof optionsOrTo === 'object'
            ? optionsOrTo
            : { to: optionsOrTo, subject, text };

        const recipient = options.to || options.email;

        const transporter = nodeMailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: recipient,
            subject: options.subject,
            text: options.text || options.message,
            html: options.html || options.message,
        };

        if (!mailOptions.to) {
            throw new Error('No recipients defined');
        }

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;