const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const fs = require('fs');
const User = require('./models/User');
const Department = require('./models/Department');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vitam-cms');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  await connectDB();

  // Clear secrets file
  fs.writeFileSync('secrets.txt', '--- User Secrets ---\n');

  // 1. Create Department
  let cseDept = await Department.findOne({ code: 'CSE' });
  if (!cseDept) {
    cseDept = await Department.create({
      name: 'Computer Science & Engineering',
      code: 'CSE'
    });
    console.log('Created CSE Department');
  } else {
    console.log('CSE Department already exists');
  }

  const users = [
    {
      name: 'Admin User',
      email: 'admin@vitam.edu.in',
      password: 'password123',
      role: 'admin',
      phoneNumber: '9999999999'
    },
    {
      name: 'HOD CSE',
      email: 'hod.cse@vitam.edu.in',
      password: 'password123',
      role: 'hod',
      department: cseDept._id,
      phoneNumber: '9999999999'
    },
    {
      name: 'Faculty User',
      email: 'faculty@vitam.edu.in',
      password: 'password123',
      role: 'faculty',
      department: cseDept._id,
      phoneNumber: '9999999999'
    },
    {
      name: 'Student User',
      email: 'student@vitam.edu.in',
      password: 'password123',
      role: 'student',
      department: cseDept._id,
      phoneNumber: '9999999999',
      semester: 1
    }
  ];

  for (const u of users) {
    let secretKey = '';
    const existingUser = await User.findOne({ email: u.email });
    
    if (existingUser) {
      console.log(`User ${u.email} already exists`);
      // Update existing user to have 2FA enabled and correct phone
      existingUser.phoneNumber = u.phoneNumber;
      existingUser.twoFactorEnabled = true;
      if (!existingUser.twoFactorSecret) {
         existingUser.twoFactorSecret = speakeasy.generateSecret({ name: `VITAM CMS (${u.role})` });
      }
      if (u.department) existingUser.department = u.department;
      await existingUser.save();
      secretKey = existingUser.twoFactorSecret.base32;
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      
      const secret = speakeasy.generateSecret({ name: `VITAM CMS (${u.role})` });
      secretKey = secret.base32;

      await User.create({
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: u.role,
        department: u.department,
        phoneNumber: u.phoneNumber,
        semester: u.semester,
        twoFactorSecret: secret,
        twoFactorEnabled: true,
        isActive: true
      });
      console.log(`Created user: ${u.email}`);
    }

    const logMsg = `User: ${u.email}\nSecret: ${secretKey}\n-------------------\n`;
    fs.appendFileSync('secrets.txt', logMsg);
    console.log(`Processed ${u.email}`);
  }

  console.log('Seeding complete. Check secrets.txt');
  process.exit();
};

seedUsers();
