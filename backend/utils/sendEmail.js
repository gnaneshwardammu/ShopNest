const nodeMailer = require('nodemailer');

const sendEmail = async (optionsOrTo, subject, text) => {
    const options = typeof optionsOrTo === 'object'
        ? optionsOrTo
        : { to: optionsOrTo, subject, text };
    const recipient = options.to || options.email;
    const emailUsername = process.env.EMAIL_USERNAME;
    // Google displays app passwords in groups of four; SMTP requires no spaces.
    const emailPassword = process.env.EMAIL_PASSWORD?.replace(/\s/g, '');

    if (!emailUsername || !emailPassword) {
        throw new Error('Email delivery is not configured');
    }
    if (!recipient) {
        throw new Error('No recipients defined');
    }

    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUsername,
            pass: emailPassword,
        },
    });
    const mailOptions = {
        from: emailUsername,
        to: recipient,
        subject: options.subject,
        text: options.text || options.message,
        html: options.html || options.message,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${result.messageId}`);
    return result;
};

module.exports = sendEmail;
