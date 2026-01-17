const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');
const Attendance = require('./models/Attendance');
const Mark = require('./models/Mark');
const Fee = require('./models/Fee');
const Department = require('./models/Department');
const Session = require('./models/Session');
const Subject = require('./models/Subject');

dotenv.config();

const seedAcademicData = async () => {
    try {
        await connectDB();
        console.log('📦 Connected to MongoDB for Seeding...');
        
        // DEBUG: Check Course Model
        // console.log('DEBUG: Course Model export:', Course);
        if (!Course || !Course.findOne) {
            console.error("CRITICAL ERROR: Course model is not loaded correctly.");
            process.exit(1);
        }

        // 1. Find the Main Student
        const student = await User.findOne({ email: 'student@vitam.edu.in' });
        if (!student) {
            console.error("❌ 'student@vitam.edu.in' not found. Run 'node seed.js' first.");
            process.exit(1);
        }
        console.log(`👤 Found Student: ${student.name}`);

        // 2. Find Faculty
        const faculty = await User.findOne({ role: 'faculty' });

        // 3. Ensure Department Exists (CSE)
        let cseDept = await Department.findOne({ code: 'CSE' });
        if (!cseDept) {
             console.log("Creating CSE Department...");
             cseDept = await Department.create({ name: 'Computer Science', code: 'CSE' });
        }

        // 4. Create Active Session
        console.log("Checking Session...");
        let session = await Session.findOne({ isActive: true });
        if (!session) {
            console.log("Creating Active Session...");
            try {
                session = await Session.create({
                    name: '2025-2026',
                    startDate: new Date('2025-06-01'),
                    endDate: new Date('2026-05-31'),
                    isActive: true, // This will trigger pre-save hook to deactivate others
                    academicYear: '2025',
                    currentSemester: 1
                });
            } catch (err) {
                 console.log("Session creation error (might already exist):", err.message);
                 session = await Session.findOne({ name: '2025-2026' });
            }
        }

        // 5. Create Subjects and Courses
        const coursesData = [
            { name: 'Data Structures', code: 'CS201', credits: 4 },
            { name: 'Web Development', code: 'CS202', credits: 3 },
            { name: 'Database Systems', code: 'CS203', credits: 4 },
            { name: 'Operating Systems', code: 'CS204', credits: 4 }
        ];

        const createdCourses = [];
        console.log("Processing courses...");

        for (const c of coursesData) {
            console.log(`Processing ${c.name}...`);
            
            // Find or Create Subject
            let subject = await Subject.findOne({ code: c.code });
            if (!subject) {
                console.log(`Creating Subject ${c.code}...`);
                subject = await Subject.create({
                    name: c.name,
                    code: c.code,
                    department: cseDept._id,
                    semester: 3,
                    credits: c.credits,
                    type: 'Theory'
                });
            }

            // Find or Create Course
            let course = null;
            try {
                // IMPORTANT: We use `code` to find course
                course = await Course.findOne({ code: c.code });
            } catch (err) {
                console.error(`Error finding course ${c.code}:`, err);
            }

            if (!course) {
                console.log(`Creating Course ${c.name}...`);
                try {
                    course = await Course.create({
                        name: c.name,
                        code: c.code,
                        department: cseDept._id,
                        subject: subject._id,
                        session: session._id,
                        semester: 3,
                        year: 2,
                        credits: c.credits,
                        assignedFaculty: faculty ? faculty._id : null
                    });
                     console.log(`📚 Created Course: ${c.name}`);
                } catch (err) {
                    console.error(`Error creating course ${c.code}:`, err);
                    continue; // Skip this course
                }
            }
            createdCourses.push(course);
        }

        // 6. Seed Attendance (Last 15 days)
        console.log("📅 Seeding Attendance...");
        await Attendance.deleteMany({ student: student._id });

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 15);

        for (let i = 0; i < 15; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);

            // Skip weekends
            if (date.getDay() === 0 || date.getDay() === 6) continue;

            for (const course of createdCourses) {
                 if (!course) continue;

                 const isPresent = Math.random() > 0.2;
                 const isDS = course.code === 'CS201';
                 // Data Structures = Bad attendance (randomly absent more)
                 // Web Dev = Good attendance
                 let status = 'Present';
                 
                 if (isDS) {
                    status = Math.random() > 0.4 ? 'Present' : 'Absent'; // 40% chance absent
                 } else {
                    status = Math.random() > 0.1 ? 'Present' : 'Absent'; // 90% chance present
                 }

                 await Attendance.create({
                     date: date,
                     course: course._id,
                     student: student._id,
                     status: status,
                     markedBy: faculty ? faculty._id : null
                 });
            }
        }

        // 7. Seed Marks
        console.log("📝 Seeding Marks...");
        await Mark.deleteMany({ student: student._id });

        const marksData = [
            { courseIndex: 0, exam: 'Mid-Term', marks: 12, max: 30 }, // CS201
            { courseIndex: 1, exam: 'Mid-Term', marks: 28, max: 30 }, // CS202
            { courseIndex: 2, exam: 'Mid-Term', marks: 22, max: 30 }, // CS203
            { courseIndex: 3, exam: 'Mid-Term', marks: 18, max: 30 }, // CS204
            { courseIndex: 0, exam: 'Assignment', marks: 8, max: 10 },
            { courseIndex: 1, exam: 'Assignment', marks: 9, max: 10 },
        ];

        for (const m of marksData) {
            if (createdCourses[m.courseIndex]) {
                await Mark.create({
                    student: student._id,
                    course: createdCourses[m.courseIndex]._id,
                    examType: m.exam,
                    marksObtained: m.marks,
                    maxMarks: m.max
                });
            }
        }

        // 8. Seed Pending Fee
        console.log("💰 Seeding Fees...");
        await Fee.deleteMany({ student: student._id });
        
        await Fee.create({
            student: student._id,
            amount: 12000,
            dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            status: 'Pending',
            semester: '3',
            type: 'Semester Tuition Fee'
        });

        console.log("\n✅ ACADEMIC DATA SEEDED SUCCESSFULLY!");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedAcademicData();
