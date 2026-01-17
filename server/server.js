const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const academicRoutes = require('./routes/academicRoutes');
const feeRoutes = require('./routes/feeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const studyMaterialRoutes = require('./routes/studyMaterialRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const systemSettingsRoutes = require('./routes/systemSettingsRoutes');
const hodRoutes = require('./routes/hodRoutes');
const userRoutes = require('./routes/userRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const studentRoutes = require('./routes/studentRoutes');
const aiRoutes = require('./routes/aiRoutes');
const careerRoutes = require('./routes/careerRoutes');
const facultyAIRoutes = require('./routes/facultyAIRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files (for local storage)
app.use('/uploads', express.static('uploads'));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/study-materials', studyMaterialRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/settings', systemSettingsRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/user', userRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/faculty-ai', facultyAIRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'VITAM CMS API is running' });
});

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
