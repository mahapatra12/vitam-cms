const twilio = require('twilio');

// Initialize Twilio client
let client;
try {
  if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
    client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  }
} catch (error) {
  console.warn('Twilio client initialization failed:', error.message);
}

/**
 * Send SMS using Twilio
 * @param {string} phoneNumber - Recipient phone number (E.164 format)
 * @param {string} message - SMS message content
 */
exports.sendSMS = async (phoneNumber, message) => {
  try {
    // In development, just log the message
    if (process.env.NODE_ENV === 'development' || !process.env.TWILIO_SID) {
      console.log(`[MOCK SMS] To ${phoneNumber}: ${message}`);
      return { success: true, mock: true };
    }

    // In production, send real SMS
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log(`[SMS SENT] SID: ${result.sid} to ${phoneNumber}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('[SMS ERROR]', error.message);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};

/**
 * Send OTP via SMS
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} otp - OTP code
 */
exports.sendOTP = async (phoneNumber, otp) => {
  const message = `Your VITAM CMS login OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`;
  return await exports.sendSMS(phoneNumber, message);
};
