import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // 🔥 hardcode for now
        auth: {
            user: process.env.EMAIL_USER,   // ✅ MATCH .env
            pass: process.env.EMAIL_PASS,   // ✅ MATCH .env
        },
    });

    const mailOptions = {
        from: `Social App <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
