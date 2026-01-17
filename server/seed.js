const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const User = require('./models/User');
const Course = require('./models/Course');
const Announcement = require('./models/Announcement');
const Fee = require('./models/Fee');
const Timetable = require('./models/Timetable');
const Subject = require('./models/Subject');
const Department = require('./models/Department');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Announcement.deleteMany({});
    await Fee.deleteMany({});
    await Timetable.deleteMany({});
    await Subject.deleteMany({});
    await Department.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password@123', salt);
    
    // --- 0. Create Departments First ---
    console.log('------------------------------------------------');
    console.log('Seeding Departments...');
    console.log('------------------------------------------------');
    const departments = [
      { name: 'Computer Science and Engineering', code: 'CSE' },
      { name: 'Electronics and Communication Engineering', code: 'ECE' },
      { name: 'Mechanical Engineering', code: 'MECH' },
      { name: 'Civil Engineering', code: 'CIVIL' },
    ];
    const createdDepartments = await Department.insertMany(departments);
    const cseDept = createdDepartments.find(d => d.code === 'CSE');
    
    // --- 1. Create Users ---
    const roles = [
      { name: 'Super Admin', email: 'superadmin@vitam.edu.in', role: 'admin', phoneNumber: '+919876543200' },
      { name: 'Admin User', email: 'admin@vitam.edu.in', role: 'admin', phoneNumber: '+919876543201' },
      { name: 'SRINOVA RAO (HOD)', email: 'hod.cse@vitam.edu.in', role: 'hod', department: cseDept._id, phoneNumber: '+919876543210' },
      { name: 'Dr. Amit Sharma', email: 'faculty@vitam.edu.in', role: 'faculty', department: cseDept._id, phoneNumber: '+919876543211' },
      { name: 'Rahul Singh', email: 'student@vitam.edu.in', role: 'student', department: cseDept._id, rollNumber: '21CSE001', year: 4, semester: 7, section: 'A', phoneNumber: '+919876543212' }
    ];

    let createdUsers = {};

    console.log('------------------------------------------------');
    console.log('Seeding Users...');
    console.log('------------------------------------------------');

    for (const u of roles) {
      const secret = speakeasy.generateSecret({ name: `VITAM CMS (${u.role})` });
      
      const user = new User({
        name: u.name,
        email: u.email,
        password: passwordHash,
        role: u.role,
        department: u.department,
        rollNumber: u.rollNumber,
        year: u.year,
        semester: u.semester,
        section: u.section,
        phoneNumber: u.phoneNumber,
        twoFactorSecret: secret,
        twoFactorEnabled: true
      });

      await user.save();
      createdUsers[u.role] = user;
      
      console.log(`Created: ${u.role.toUpperCase()}`);
      console.log(`Email: ${u.email}`);
      console.log(`Password: Password@123`);
      console.log(`Auth Secret: ${secret.base32}`); 
      console.log('------------------------------------------------');
    }

    // --- 2. Create Subjects ---
    console.log('Seeding Subjects...');
    const subjects = [
      { name: 'Data Structures', code: 'CS201', department: cseDept._id, semester: 3, credits: 4 },
      { name: 'Operating Systems', code: 'CS202', department: cseDept._id, semester: 4, credits: 3 },
      { name: 'Database Management', code: 'CS203', department: cseDept._id, semester: 4, credits: 4 },
      { name: 'Computer Networks', code: 'CS204', department: cseDept._id, semester: 5, credits: 3 },
      { name: 'Artificial Intelligence', code: 'CS301', department: cseDept._id, semester: 7, credits: 4 },
      { name: 'Machine Learning', code: 'CS302', department: cseDept._id, semester: 7, credits: 4 },
    ];
    const createdSubjects = await Subject.insertMany(subjects);
    const subjectMap = {};
    createdSubjects.forEach(s => subjectMap[s.code] = s._id);

    // --- 3. Create Courses (Skipping for now due to Session requirement) ---
    console.log('Skipping Courses (requires Session model)...');

    // --- 4. Skipping Timetable (requires Session model) ---
    console.log('Skipping Timetable (requires Session model)...');

    // --- 5. Create Announcements ---
    console.log('Seeding Announcements...');
    const announcements = [
      { title: 'Mid-Term Exams Schedule', content: 'The mid-term examinations for all semesters will commence from 15th April. Please check the notice board for the detailed timetable.', type: 'Urgent', createdBy: createdUsers['admin']._id },
      { title: 'Annual Tech Fest 2025', content: 'Registration for the Annual Tech Fest "VitamTech" is now open. Visit the student council office to register your teams.', type: 'Event', createdBy: createdUsers['admin']._id },
      { title: 'Library Holiday', content: 'The central library will remain closed this Sunday due to maintenance work.', type: 'General', createdBy: createdUsers['admin']._id },
    ];
    await Announcement.insertMany(announcements);

    // --- 6. Create Fees for Student ---
    console.log('Seeding Fees...');
    const fees = [
      { student: createdUsers['student']._id, amount: 45000, dueDate: new Date('2025-05-10'), semester: '7', type: 'Tuition Fee', status: 'Pending' },
      { student: createdUsers['student']._id, amount: 2500, dueDate: new Date('2025-04-20'), semester: '7', type: 'Exam Fee', status: 'Pending' },
      { student: createdUsers['student']._id, amount: 5000, dueDate: new Date('2024-12-10'), semester: '6', type: 'Library Fine', status: 'Paid', paymentDate: new Date(), transactionId: 'TXN123456789' },
    ];
    await Fee.insertMany(fees);

    console.log('Seeding Complete. Database is now populated with rich data.');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
