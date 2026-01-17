const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkSecrets = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vitam-cms');
    console.log('MongoDB Connected');

    const users = await User.find({ 
      email: { $in: ['admin@vitam.edu.in', 'hod.cse@vitam.edu.in', 'faculty@vitam.edu.in', 'student@vitam.edu.in'] }
    }).select('email twoFactorSecret');

    users.forEach(user => {
      console.log('\n-------------------');
      console.log('Email:', user.email);
      console.log('twoFactorSecret:', JSON.stringify(user.twoFactorSecret, null, 2));
      console.log('Has base32:', !!user.twoFactorSecret?.base32);
      console.log('Has otpauth_url:', !!user.twoFactorSecret?.otpauth_url);
    });

    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

checkSecrets();
