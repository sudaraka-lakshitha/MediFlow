import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const senderAddress = env.MAIL_FROM || env.SMTP_USER;
const configured = Boolean(env.SMTP_USER && env.SMTP_PASS && senderAddress);
const transporter = configured ? nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
}) : null;

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
})[character]);

export const mailService = {
  isConfigured: () => configured,
  async sendPasswordResetOtp({ email, fullName, otp, expiresInMinutes }) {
    if (!transporter) throw new AppError(503, 'Email password recovery is not configured. Ask the administrator to configure SMTP.');
    const safeName = escapeHtml(fullName);
    const safeOtp = escapeHtml(otp);
    await transporter.sendMail({
      from: `MediFlow Pharmacy <${senderAddress}>`,
      to: email,
      subject: 'Your MediFlow password reset code',
      text: `Hello ${fullName},\n\nYour MediFlow password reset code is ${otp}. It expires in ${expiresInMinutes} minutes.\n\nIf you did not request this, you can ignore this email. Never share this code with anyone.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#20302d"><h2>MediFlow password recovery</h2><p>Hello ${safeName},</p><p>Use this one-time code to reset your password:</p><div style="font-size:30px;font-weight:700;letter-spacing:8px;padding:18px;text-align:center;background:#eef7f5;border-radius:10px">${safeOtp}</div><p>This code expires in <strong>${expiresInMinutes} minutes</strong>.</p><p style="color:#66736f">If you did not request a password reset, ignore this email. Never share this code with anyone.</p></div>`,
    });
  },
};
