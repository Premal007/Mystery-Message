import nodemailer from 'nodemailer';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log('Entering mail sending part');

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 587,
      secure: process.env.MAIL_SECURE === 'true' || false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const html = `
      <html>
        <body>
          <h2>Hello ${username},</h2>
          <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
          <p style="font-size: 20px; font-weight: 700;">${verifyCode}</p>
          <p>If you did not request this code, please ignore this email.</p>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: 'Acme <onboarding@resend.dev>',
      to: `${email}`,
      subject: 'Mystery Message Verification Code',
      html,
    });

    console.log('Here is the response coming', info);

    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}
