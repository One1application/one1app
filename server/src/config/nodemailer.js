import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    port : process.env.EMAIL_PORT,
    host : process.env.EMAIL_HOST,
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },

    tls: {
        rejectUnauthorized: false,
    },
});

export default transporter;