import * as nodemailer from 'nodemailer';
import * as sgMail from '@sendgrid/mail';
import { config } from 'dotenv';
config();

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Sesuaikan dengan penyedia SMTP
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `${process.env.SMTP_NAME} <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent to %s with id: %s', to, info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export async function sendGridEmail(
  to: string,
  subject: string,
  text: string,
  html: string
): Promise<void> {
  const msg = {
    to, // Recipient
    from: "marifsulaksono@gmail.com", // Verified sender
    subject, // Email subject
    text, // Plain text content
    html, // HTML content
  };

  try {
    const response = await sgMail.send(msg);
    console.log('Email sent successfully');
    console.log('Status Code:', response[0].statusCode);
    console.log('Headers:', response[0].headers);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Error sending email');
  }
}
