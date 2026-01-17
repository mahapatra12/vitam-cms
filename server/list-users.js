const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vitam-cms');
    console.log('MongoDB Connected\n');

    const users = await User.find({}).select('email role name');

    console.log('All users in database:');
    console.log('======================');
    users.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.name}`);
      console.log(`Role: ${user.role}`);
      console.log('---');
    });

    console.log(`\nTotal users: ${users.length}`);

    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

checkUsers();
