const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const fs = require('fs');
const User = require('./models/User');
const Department = require('./models/Department');
const dotenv = require('dotenv');

dotenv.config();

const createHODUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vitam-cms');
    console.log('MongoDB Connected\n');

    // Get CSE Department
    const cseDept = await Department.findOne({ code: 'CSE' });
    if (!cseDept) {
      console.error('CSE Department not found!');
      process.exit(1);
    }

    // Check if hod@vitam.edu.in already exists
    const existingUser = await User.findOne({ email: 'hod@vitam.edu.in' });
    if (existingUser) {
      console.log('User hod@vitam.edu.in already exists');
      console.log('Secret Key:', existingUser.twoFactorSecret.base32);
      process.exit(0);
    }

    // Create new HOD user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const secret = speakeasy.generateSecret({ name: 'VITAM CMS (hod)' });

    await User.create({
      name: 'HOD User',
      email: 'hod@vitam.edu.in',
      password: hashedPassword,
      role: 'hod',
      department: cseDept._id,
      phoneNumber: '9999999999',
      twoFactorSecret: secret,
      twoFactorEnabled: true,
      isActive: true
    });

    console.log('✅ Created user: hod@vitam.edu.in');
    console.log('Password: password123');
    console.log('Secret Key:', secret.base32);
    console.log('\nAdd this to Google Authenticator:');
    console.log('Account: VITAM HOD');
    console.log('Key:', secret.base32);

    // Append to secrets file
    const logMsg = `\nUser: hod@vitam.edu.in\nSecret: ${secret.base32}\n-------------------\n`;
    fs.appendFileSync('secrets.txt', logMsg);
    console.log('\n✅ Secret also saved to secrets.txt');

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

createHODUser();
