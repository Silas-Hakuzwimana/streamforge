const transporter = require('../config/email');

/**
 * Send OTP Email with professional styling
 * @param {string} to - recipient email
 * @param {string} otpCode - 6-digit OTP
 * @param {string} userName - user's name for personalization
 */
const sendOtpEmail = async (to, otpCode, userName = '') => {
  try {
    const greeting = userName ? `Dear ${userName}` : 'Dear User';
    
    await transporter.sendMail({
      from: `"StreamForge Security" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'StreamForge Account Verification - OTP Required',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>StreamForge OTP Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                StreamForge
              </h1>
              <p style="margin: 8px 0 0 0; color: #e8eaed; font-size: 14px; opacity: 0.9;">
                Account Security Verification
              </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px;">
              <p style="margin: 0 0 24px 0; color: #2c3e50; font-size: 16px; line-height: 1.5;">
                ${greeting},
              </p>
              
              <p style="margin: 0 0 24px 0; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                We received a request to verify your StreamForge account. Please use the following One-Time Password (OTP) to complete your authentication:
              </p>
              
              <!-- OTP Box -->
              <div style="background-color: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 24px; text-align: center; margin: 32px 0;">
                <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                  Your Verification Code
                </p>
                <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; color: #495057; letter-spacing: 4px; background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 6px; padding: 16px; display: inline-block; margin: 8px 0;">
                  ${otpCode}
                </div>
                <p style="margin: 8px 0 0 0; color: #dc3545; font-size: 14px; font-weight: 500;">
                  ⏰ Expires in 10 minutes
                </p>
              </div>
              
              <!-- Security Notice -->
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <h4 style="margin: 0 0 8px 0; color: #856404; font-size: 14px; font-weight: 600;">
                  🔒 Security Notice
                </h4>
                <p style="margin: 0; color: #856404; font-size: 13px; line-height: 1.4;">
                  If you did not request this verification, please ignore this email or contact our support team immediately.
                </p>
              </div>
              
              <p style="margin: 24px 0 0 0; color: #6c757d; font-size: 14px; line-height: 1.5;">
                Best regards,<br>
                <strong>The StreamForge Security Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 24px 40px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #6c757d; font-size: 12px; text-align: center; line-height: 1.4;">
                This is an automated security message from StreamForge.<br>
                Please do not reply to this email. For assistance, contact our support team.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Plain text fallback
      text: `
StreamForge Account Verification

${greeting},

We received a request to verify your StreamForge account. Please use the following One-Time Password (OTP) to complete your authentication:

Your Verification Code: ${otpCode}

⏰ This code will expire in 10 minutes.

🔒 Security Notice: If you did not request this verification, please ignore this email or contact our support team immediately.

Best regards,
The StreamForge Security Team

---
This is an automated security message from StreamForge.
Please do not reply to this email. For assistance, contact our support team.
      `
    });
    
    console.log(`✅ Professional OTP email sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    throw new Error('Failed to send OTP email - please try again later');
  }
};

/**
 * Send Password Reset Email with professional styling
 * @param {string} to - recipient email
 * @param {string} resetUrl - frontend URL with reset token
 * @param {string} userName - user's name for personalization
 */
const sendResetEmail = async (to, resetUrl, userName = '') => {
  try {
    const greeting = userName ? `Dear ${userName}` : 'Dear User';
    
    await transporter.sendMail({
      from: `"StreamForge Security" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'StreamForge Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>StreamForge Password Reset</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                StreamForge
              </h1>
              <p style="margin: 8px 0 0 0; color: #e8eaed; font-size: 14px; opacity: 0.9;">
                Password Reset Request
              </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px;">
              <p style="margin: 0 0 24px 0; color: #2c3e50; font-size: 16px; line-height: 1.5;">
                ${greeting},
              </p>
              
              <p style="margin: 0 0 24px 0; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                We received a request to reset the password for your StreamForge account. If you made this request, please click the button below to create a new password:
              </p>
              
              <!-- Reset Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-size: 16px; font-weight: 600; text-align: center; transition: all 0.3s ease;">
                  Reset My Password
                </a>
              </div>
              
              <p style="margin: 24px 0; color: #6c757d; font-size: 14px; line-height: 1.5; text-align: center;">
                Or copy and paste this link into your browser:<br>
                <span style="word-break: break-all; color: #495057; font-family: monospace; background-color: #f8f9fa; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                  ${resetUrl}
                </span>
              </p>
              
              <!-- Security Notice -->
              <div style="background-color: #d1ecf1; border-left: 4px solid #17a2b8; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <h4 style="margin: 0 0 8px 0; color: #0c5460; font-size: 14px; font-weight: 600;">
                  🔒 Security Information
                </h4>
                <ul style="margin: 0; padding-left: 16px; color: #0c5460; font-size: 13px; line-height: 1.4;">
                  <li>This password reset link will expire in 1 hour for your security</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Your current password remains unchanged until you complete the reset process</li>
                </ul>
              </div>
              
              <p style="margin: 24px 0 0 0; color: #6c757d; font-size: 14px; line-height: 1.5;">
                For your security, if you continue to receive these emails without requesting them, please contact our support team immediately.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e9ecef; margin: 24px 0;">
              
              <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.5;">
                Best regards,<br>
                <strong>The StreamForge Security Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 24px 40px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #6c757d; font-size: 12px; text-align: center; line-height: 1.4;">
                This is an automated security message from StreamForge.<br>
                Please do not reply to this email. For assistance, visit our help center or contact support.
              </p>
              <p style="margin: 12px 0 0 0; color: #adb5bd; font-size: 11px; text-align: center;">
                © ${new Date().getFullYear()} StreamForge. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Plain text fallback
      text: `
StreamForge Password Reset Request

${greeting},

We received a request to reset the password for your StreamForge account.

If you made this request, please visit the following link to create a new password:
${resetUrl}

SECURITY INFORMATION:
• This password reset link will expire in 1 hour for your security
• If you didn't request this reset, please ignore this email
• Your current password remains unchanged until you complete the reset process

For your security, if you continue to receive these emails without requesting them, please contact our support team immediately.

Best regards,
The StreamForge Security Team

---
This is an automated security message from StreamForge.
Please do not reply to this email. For assistance, visit our help center or contact support.

© ${new Date().getFullYear()} StreamForge. All rights reserved.
      `
    });
    
    console.log(`✅ Professional password reset email sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email - please try again later');
  }
};

/**
 * Send Welcome Email for new registrations
 * @param {string} to - recipient email
 * @param {string} userName - user's name
 * @param {string} username - user's username
 */
const sendWelcomeEmail = async (to, userName, username) => {
  try {
    await transporter.sendMail({
      from: `"StreamForge Team" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Welcome to StreamForge - Account Created Successfully',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to StreamForge</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                Welcome to StreamForge
              </h1>
              <p style="margin: 8px 0 0 0; color: #e8f5e8; font-size: 14px; opacity: 0.9;">
                Your account has been created successfully
              </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px;">
              <p style="margin: 0 0 24px 0; color: #2c3e50; font-size: 16px; line-height: 1.5;">
                Dear ${userName},
              </p>
              
              <p style="margin: 0 0 24px 0; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                Congratulations! Your StreamForge account has been successfully created. We're excited to have you join our community.
              </p>
              
              <!-- Account Details -->
              <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 20px; margin: 24px 0;">
                <h4 style="margin: 0 0 12px 0; color: #495057; font-size: 16px; font-weight: 600;">
                  Account Details
                </h4>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6c757d; font-size: 14px; font-weight: 500; width: 30%;">Name:</td>
                    <td style="padding: 8px 0; color: #495057; font-size: 14px;">${userName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">Username:</td>
                    <td style="padding: 8px 0; color: #495057; font-size: 14px; font-family: monospace;">${username}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6c757d; font-size: 14px; font-weight: 500;">Email:</td>
                    <td style="padding: 8px 0; color: #495057; font-size: 14px;">${to}</td>
                  </tr>
                </table>
              </div>
              
              <!-- Next Steps -->
              <div style="background-color: #e7f3ff; border-left: 4px solid #007bff; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <h4 style="margin: 0 0 12px 0; color: #004085; font-size: 14px; font-weight: 600;">
                  📋 Next Steps
                </h4>
                <ol style="margin: 0; padding-left: 16px; color: #004085; font-size: 13px; line-height: 1.5;">
                  <li>Log in to your account using your username and password</li>
                  <li>Complete your profile setup</li>
                  <li>Explore the platform features</li>
                  <li>Contact support if you need any assistance</li>
                </ol>
              </div>
              
              <p style="margin: 24px 0 0 0; color: #6c757d; font-size: 14px; line-height: 1.5;">
                Thank you for choosing StreamForge. We look forward to providing you with an exceptional experience.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e9ecef; margin: 24px 0;">
              
              <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.5;">
                Best regards,<br>
                <strong>The StreamForge Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 24px 40px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #6c757d; font-size: 12px; text-align: center; line-height: 1.4;">
                This is an automated message from StreamForge.<br>
                For support, visit our help center or contact our team.
              </p>
              <p style="margin: 12px 0 0 0; color: #adb5bd; font-size: 11px; text-align: center;">
                © ${new Date().getFullYear()} StreamForge. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Plain text fallback
      text: `
Welcome to StreamForge

Dear ${userName},

Congratulations! Your StreamForge account has been successfully created. We're excited to have you join our community.

ACCOUNT DETAILS:
• Name: ${userName}
• Username: ${username}
• Email: ${to}

NEXT STEPS:
1. Log in to your account using your username and password
2. Complete your profile setup
3. Explore the platform features
4. Contact support if you need any assistance

Thank you for choosing StreamForge. We look forward to providing you with an exceptional experience.

Best regards,
The StreamForge Team

---
This is an automated message from StreamForge.
For support, visit our help center or contact our team.

© ${new Date().getFullYear()} StreamForge. All rights reserved.
      `
    });
    
    console.log(`✅ Professional welcome email sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    throw new Error('Failed to send welcome email - please try again later');
  }
};

/**
 * Send Account Unlock Email
 * @param {string} to - recipient email
 * @param {string} unlockUrl - frontend URL with unlock token
 * @param {string} userName - user's name
 */
const sendUnlockEmail = async (to, unlockUrl, userName = '') => {
  try {
    const greeting = userName ? `Dear ${userName}` : 'Dear User';
    
    await transporter.sendMail({
      from: `"StreamForge Security" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'StreamForge Account Security Alert - Account Locked',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>StreamForge Account Security Alert</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                StreamForge
              </h1>
              <p style="margin: 8px 0 0 0; color: #f8d7da; font-size: 14px; opacity: 0.9;">
                Account Security Alert
              </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px;">
              <p style="margin: 0 0 24px 0; color: #2c3e50; font-size: 16px; line-height: 1.5;">
                ${greeting},
              </p>
              
              <p style="margin: 0 0 24px 0; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                Your StreamForge account has been temporarily locked due to multiple failed login attempts. This is a security measure to protect your account.
              </p>
              
              <!-- Alert Box -->
              <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 6px; padding: 20px; margin: 24px 0; text-align: center;">
                <h4 style="margin: 0 0 12px 0; color: #721c24; font-size: 16px; font-weight: 600;">
                  🚨 Account Temporarily Locked
                </h4>
                <p style="margin: 0; color: #721c24; font-size: 14px; line-height: 1.4;">
                  Multiple failed login attempts detected
                </p>
              </div>
              
              <p style="margin: 24px 0; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                To unlock your account and regain access, please click the button below:
              </p>
              
              <!-- Unlock Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${unlockUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-size: 16px; font-weight: 600; text-align: center;">
                  Unlock My Account
                </a>
              </div>
              
              <p style="margin: 24px 0; color: #6c757d; font-size: 14px; line-height: 1.5; text-align: center;">
                Or copy and paste this link into your browser:<br>
                <span style="word-break: break-all; color: #495057; font-family: monospace; background-color: #f8f9fa; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                  ${unlockUrl}
                </span>
              </p>
              
              <!-- Security Tips -->
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <h4 style="margin: 0 0 12px 0; color: #856404; font-size: 14px; font-weight: 600;">
                  🛡️ Security Recommendations
                </h4>
                <ul style="margin: 0; padding-left: 16px; color: #856404; font-size: 13px; line-height: 1.4;">
                  <li>Use a strong, unique password for your StreamForge account</li>
                  <li>Enable two-factor authentication if available</li>
                  <li>Never share your login credentials with others</li>
                  <li>Contact support immediately if you suspect unauthorized access</li>
                </ul>
              </div>
              
              <p style="margin: 24px 0 0 0; color: #6c757d; font-size: 14px; line-height: 1.5;">
                If you did not attempt to log in to your account, please contact our security team immediately as your account may be compromised.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e9ecef; margin: 24px 0;">
              
              <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.5;">
                Best regards,<br>
                <strong>The StreamForge Security Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 24px 40px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #6c757d; font-size: 12px; text-align: center; line-height: 1.4;">
                This is an automated security message from StreamForge.<br>
                Please do not reply to this email. For urgent security matters, contact our support team immediately.
              </p>
              <p style="margin: 12px 0 0 0; color: #adb5bd; font-size: 11px; text-align: center;">
                © ${new Date().getFullYear()} StreamForge. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Plain text fallback
      text: `
StreamForge Account Security Alert

${greeting},

Your StreamForge account has been temporarily locked due to multiple failed login attempts. This is a security measure to protect your account.

🚨 ACCOUNT TEMPORARILY LOCKED
Multiple failed login attempts detected

To unlock your account and regain access, please visit:
${unlockUrl}

SECURITY RECOMMENDATIONS:
• Use a strong, unique password for your StreamForge account
• Enable two-factor authentication if available
• Never share your login credentials with others
• Contact support immediately if you suspect unauthorized access

If you did not attempt to log in to your account, please contact our security team immediately as your account may be compromised.

Best regards,
The StreamForge Security Team

---
This is an automated security message from StreamForge.
Please do not reply to this email. For urgent security matters, contact our support team immediately.

© ${new Date().getFullYear()} StreamForge. All rights reserved.
      `
    });
    
    console.log(`✅ Professional account unlock email sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send unlock email:', error);
    throw new Error('Failed to send unlock email - please try again later');
  }
};

/**
 * Send Failed Login Attempt Notification
 * @param {string} to - recipient email
 * @param {string} userName - user's name
 * @param {number} failedAttempts - current number of failed attempts
 * @param {Date} lockUntil - when account will be unlocked (if locked)
 */
const sendFailedLoginEmail = async (to, userName, failedAttempts, lockUntil = null) => {
  try {
    const greeting = userName ? `Dear ${userName}` : 'Dear User';
    const isLocked = lockUntil && lockUntil > new Date();
    
    await transporter.sendMail({
      from: `"StreamForge Security" <${process.env.EMAIL_USER}>`,
      to,
      subject: `StreamForge Security Alert - Failed Login Attempt${isLocked ? ' (Account Locked)' : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>StreamForge Security Alert</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #fd7e14 0%, #e83e8c 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                StreamForge
              </h1>
              <p style="margin: 8px 0 0 0; color: #fff2e6; font-size: 14px; opacity: 0.9;">
                Security Alert - Failed Login Attempt
              </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px;">
              <p style="margin: 0 0 24px 0; color: #2c3e50; font-size: 16px; line-height: 1.5;">
                ${greeting},
              </p>
              
              <p style="margin: 0 0 24px 0; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                We detected a failed login attempt on your StreamForge account. This email is sent as a security precaution to keep you informed of account activity.
              </p>
              
              <!-- Alert Box -->
              <div style="background-color: ${isLocked ? '#f8d7da' : '#fff3cd'}; border: 1px solid ${isLocked ? '#f5c6cb' : '#ffeaa7'}; border-radius: 6px; padding: 20px; margin: 24px 0;">
                <h4 style="margin: 0 0 12px 0; color: ${isLocked ? '#721c24' : '#856404'}; font-size: 16px; font-weight: 600;">
                  ${isLocked ? '🔒 Account Locked' : '⚠️ Security Alert'}
                </h4>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; color: ${isLocked ? '#721c24' : '#856404'}; font-size: 13px; font-weight: 500; width: 40%;">Failed Attempts:</td>
                    <td style="padding: 4px 0; color: ${isLocked ? '#721c24' : '#856404'}; font-size: 13px; font-weight: 600;">${failedAttempts} of 5</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: ${isLocked ? '#721c24' : '#856404'}; font-size: 13px; font-weight: 500;">Timestamp:</td>
                    <td style="padding: 4px 0; color: ${isLocked ? '#721c24' : '#856404'}; font-size: 13px;">${new Date().toLocaleString()}</td>
                  </tr>
                  ${isLocked ? `
                  <tr>
                    <td style="padding: 4px 0; color: #721c24; font-size: 13px; font-weight: 500;">Locked Until:</td>
                    <td style="padding: 4px 0; color: #721c24; font-size: 13px; font-weight: 600;">${lockUntil.toLocaleString()}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              ${isLocked ? `
              <p style="margin: 24px 0; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                Your account has been temporarily locked for security reasons. You can unlock it immediately by clicking the button below:
              </p>
              
              <!-- Unlock Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${unlockUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                  Unlock My Account
                </a>
              </div>
              ` : `
              <p style="margin: 24px 0; color: #2c3e50; font-size: 16px; line-height: 1.6;">
                If this was you, please try logging in again with the correct password. If you've forgotten your password, you can reset it using the password recovery option.
              </p>
              `}
              
              <!-- Security Notice -->
              <div style="background-color: #d1ecf1; border-left: 4px solid #17a2b8; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <h4 style="margin: 0 0 8px 0; color: #0c5460; font-size: 14px; font-weight: 600;">
                  🔒 If This Wasn't You
                </h4>
                <p style="margin: 0; color: #0c5460; font-size: 13px; line-height: 1.4;">
                  If you did not attempt to log in, your account may be under attack. Please contact our security team immediately and consider changing your password.
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e9ecef; margin: 24px 0;">
              
              <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.5;">
                Best regards,<br>
                <strong>The StreamForge Security Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 24px 40px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #6c757d; font-size: 12px; text-align: center; line-height: 1.4;">
                This is an automated security message from StreamForge.<br>
                For urgent security matters, contact our support team immediately.
              </p>
              <p style="margin: 12px 0 0 0; color: #adb5bd; font-size: 11px; text-align: center;">
                © ${new Date().getFullYear()} StreamForge. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Plain text fallback
      text: `
StreamForge Security Alert

${greeting},

We detected a failed login attempt on your StreamForge account. This email is sent as a security precaution.

SECURITY DETAILS:
• Failed Attempts: ${failedAttempts} of 5
• Timestamp: ${new Date().toLocaleString()}
${isLocked ? `• Account Status: LOCKED until ${lockUntil.toLocaleString()}` : '• Account Status: Active'}

${isLocked ? `
ACCOUNT LOCKED
Your account has been temporarily locked for security reasons. 
You can unlock it immediately by visiting: ${unlockUrl}
` : `
If this was you, please try logging in again with the correct password. 
If you've forgotten your password, you can reset it using the password recovery option.
`}

🔒 IF THIS WASN'T YOU:
If you did not attempt to log in, your account may be under attack. Please contact our security team immediately and consider changing your password.

Best regards,
The StreamForge Security Team

---
This is an automated security message from StreamForge.
For urgent security matters, contact our support team immediately.

© ${new Date().getFullYear()} StreamForge. All rights reserved.
      `
    });
    
    console.log(`✅ Professional failed login notification sent to ${to}`);
  } catch (error) {
    console.error('❌ Failed to send login notification email:', error);
    throw new Error('Failed to send security notification email');
  }
};

module.exports = {
  sendOtpEmail,
  sendResetEmail,
  sendWelcomeEmail,
  sendUnlockEmail,
  sendFailedLoginEmail,
};