const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Send email using SendGrid
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML email content
 */
exports.sendEmail = async (to, subject, html) => {
  try {
    // In development, just log the email
    if (process.env.NODE_ENV === 'development' || !process.env.SENDGRID_API_KEY) {
      console.log(`[MOCK EMAIL] To ${to}: ${subject}`);
      console.log(`Content: ${html.substring(0, 100)}...`);
      return { success: true, mock: true };
    }

    // In production, send real email
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@vitam.edu.in',
      subject,
      html
    };

    const result = await sgMail.send(msg);
    console.log(`[EMAIL SENT] To ${to}: ${subject}`);
    return { success: true, messageId: result[0].headers['x-message-id'] };
  } catch (error) {
    console.error('[EMAIL ERROR]', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send OTP via Email
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP code
 * @param {string} userName - User's name
 */
exports.sendOTP = async (email, otp, userName = 'User') => {
  const subject = 'VITAM CMS - Login Verification Code';
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 VITAM CMS</h1>
          <p>Login Verification</p>
        </div>
        <div class="content">
          <p>Hello <strong>${userName}</strong>,</p>
          <p>You are attempting to log in to your VITAM CMS account. Please use the following One-Time Password (OTP) to complete your login:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <p style="margin-top: 10px; color: #666;">Valid for 10 minutes</p>
          </div>

          <div class="warning">
            <strong>⚠️ Security Notice:</strong> Never share this code with anyone. VITAM CMS staff will never ask for your OTP.
          </div>

          <p>If you did not attempt to log in, please ignore this email or contact support immediately.</p>
          
          <p>Best regards,<br><strong>VITAM CMS Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} VITAM CMS. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await exports.sendEmail(email, subject, html);
};
