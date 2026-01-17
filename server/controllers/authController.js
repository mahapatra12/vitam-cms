const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { sendOTP: sendEmailOTP } = require('../utils/email');
const { sendOTP: sendSmsOTP } = require('../utils/sms');
const auditService = require('../services/auditService');

// Helper: Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Create User (Admin Only)
exports.createUser = async (req, res) => {
  const { name, email, password, role, department, rollNumber, year, phoneNumber } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate Authenticator Secret automatically for the user
    const secret = speakeasy.generateSecret({ name: `VITAM CMS (${email})` });

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      rollNumber,
      year,
      phoneNumber,
      twoFactorSecret: secret // Save secret immediately
    });

    // In a real app, you would email the QR code or Setup Key to the user here
    // For this demo, we return it so the Admin can share it, or we assume the user sets it up later.
    // However, the requirement says "login > 2fa", implying it must be set up. 
    // We will return the secret details so the Admin can give it to the user.

    res.status(201).json({
      message: 'User created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        authenticatorSecret: secret.base32, // Admin needs to give this to user
        authenticatorOtpauth: secret.otpauth_url
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Authenticator Setup (QR Code)
exports.getAuthenticatorSetup = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+twoFactorSecret');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const qrCodeUrl = await qrcode.toDataURL(user.twoFactorSecret.otpauth_url);
    
    res.json({
      qrCode: qrCodeUrl,
      secret: user.twoFactorSecret.base32,
      setupComplete: user.twoFactorEnabled || false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login (Step 1: Validate Password & Trigger MFA)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate OTPs
    // FOR DEV: Hardcode OTPs to 123456 so we can login without valid SMS/Email keys
    const smsOtp = '123456'; // generateOTP();
    const emailOtp = '123456'; // generateOTP();

    // Save OTPs to DB
    user.smsOtp = smsOtp;
    user.smsOtpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    user.emailOtp = emailOtp;
    user.emailOtpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send OTPs via SMS and Email
    try {
      await Promise.all([
        sendSmsOTP(user.phoneNumber, smsOtp),
        sendEmailOTP(user.email, emailOtp, user.name)
      ]);
    } catch (error) {
      console.error('[OTP SEND ERROR]', error.message);
      // Continue even if sending fails (for development)
    }

    // Return Temp Token
    const tempToken = jwt.sign({ id: user._id, isMfaPending: true }, process.env.JWT_SECRET || 'secret', { expiresIn: '10m' });

    await auditService.log(user._id, 'LOGIN_ATTEMPT', { status: 'MFA_INITIATED' }, req);

    res.json({
      requireMfa: true,
      tempToken,
      message: 'MFA codes sent to email and phone'
    });

  } catch (error) {
    await auditService.log(null, 'LOGIN_FAILED', { email, error: error.message }, req);
    res.status(500).json({ message: error.message });
  }
};

// Verify MFA (Step 2: Verify SMS, Email, OR Authenticator)
exports.verifyMfa = async (req, res) => {
  const { tempToken, code, method } = req.body; // method: 'sms', 'email', or 'authenticator'
  
  // Legacy support for old frontend (if it sends all 3)
  const { smsCode, emailCode, authCode } = req.body;
  
  try {
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'secret');
    const user = await User.findById(decoded.id).select('+twoFactorSecret');
    
    if (!user) return res.status(400).json({ message: 'User not found' });

    let isValid = false;

    // Universal Dev Bypass
    if (code === '123456' || smsCode === '123456' || emailCode === '123456' || authCode === '123456') {
      isValid = true;
    } else {
      // Validate based on method
      if (method === 'sms' || smsCode) {
        const checkCode = code || smsCode;
        if (user.smsOtp === checkCode && user.smsOtpExpires > Date.now()) {
          isValid = true;
        }
      }
      
      if (!isValid && (method === 'email' || emailCode)) {
        const checkCode = code || emailCode;
        if (user.emailOtp === checkCode && user.emailOtpExpires > Date.now()) {
          isValid = true;
        }
      }
      
      if (!isValid && (method === 'authenticator' || authCode)) {
        const checkCode = code || authCode;
        isValid = speakeasy.totp.verify({
          secret: user.twoFactorSecret.base32,
          encoding: 'base32',
          token: checkCode,
          window: 1
        });
      }
    }

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid Verification Code' });
    }

    // Clear OTPs
    user.smsOtp = undefined;
    user.smsOtpExpires = undefined;
    user.emailOtp = undefined;
    user.emailOtpExpires = undefined;
    user.twoFactorEnabled = true; 
    await user.save();

    // Success - Return Real Token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });

    await auditService.log(user._id, 'LOGIN_SUCCESS', { method: method || 'MFA' }, req);

  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired session' });
  }
};

// Get Users (For Admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -twoFactorSecret -smsOtp -emailOtp');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Update Profile (Self)
exports.updateProfile = async (req, res) => {
  try {
    const { phoneNumber, address } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address; // Assuming address field exists or we add it
    
    await user.save();
    
    res.json({ 
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
