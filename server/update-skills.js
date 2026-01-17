const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const Course = require('./models/Course');

const updateSkills = async () => {
    try {
        await connectDB();
        console.log('🔗 Connected to DB for Skill Injection...');

        const skillMap = {
            'CS201': ['Data Structures', 'Algorithms', 'C++', 'Problem Solving', 'Memory Management'], // Data Structures
            'CS202': ['HTML', 'CSS', 'JavaScript', 'React', 'Frontend Development', 'Web APIs'],     // Web Dev
            'CS203': ['SQL', 'Database Design', 'Normalization', 'MongoDB', 'Data Modeling'],       // Database Systems
            'CS204': ['Linux', 'Process Management', 'Concurrency', 'Shell Scripting', 'OS Architecture'] // Operating Systems
        };

        for (const [code, skills] of Object.entries(skillMap)) {
            const course = await Course.findOne({ code });
            if (course) {
                course.skills = skills;
                await course.save();
                console.log(`✅ Updated Skills for ${course.name} (${code}): [${skills.join(', ')}]`);
            } else {
                console.log(`⚠️ Course ${code} not found in DB.`);
            }
        }

        console.log('🚀 Skill Injection Complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error updating skills:', error);
        process.exit(1);
    }
};

updateSkills();
