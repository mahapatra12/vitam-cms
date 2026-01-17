const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/User');
const Mark = require('../models/Mark');
const Attendance = require('../models/Attendance');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    
    // 1. Validation & Data Fetching
    if (!studentId) return res.status(400).json({ message: "Student ID required" });

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const marks = await Mark.find({ student: studentId }).populate('course');
    const attendance = await Attendance.find({ student: studentId }).populate('course');

    // 2. Pre-processing for AI (The "Faculty Report" Context)
    let marksText = "";
    let lowMarks = [];
    marks.forEach(m => {
        if(m.course) {
            marksText += `- ${m.course.name}: ${m.marksObtained}/${m.maxMarks}\n`;
            if ((m.marksObtained/m.maxMarks) < 0.4) lowMarks.push(m.course.name);
        }
    });

    let totalClasses = 0, presentClasses = 0;
    attendance.forEach(a => { totalClasses++; if(a.status === 'Present') presentClasses++; });
    const attendPct = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

    // 3. The "Faculty Assistant" Prompt
    const prompt = `
      Act as an AI Assistant to a Senior Professor.
      
      TARGET STUDENT:
      Name: ${student.name} | Year: ${student.year}
      Attendance: ${attendPct}%
      Failed Subjects: ${lowMarks.length > 0 ? lowMarks.join(', ') : 'None'}
      
      ACADEMIC RECORD:
      ${marksText}
      
      TASK:
      1. CLASSIFY: Is this student "At Risk", "Average", or "High Performer"?
      2. RISK FACTOR: Explain WHY in one sentence (e.g., "High risk due to < 75% attendance").
      3. WEAKNESS: Identify the specific subject causing the most trouble.
      4. STRATEGY: Suggest 3 specific actions for the Faculty Member (NOT the student).
         - E.g., "Schedule extra lab time", "Call parents regarding attendance", "Assign a peer mentor".
      
      OUTPUT FORMAT (JSON ONLY):
      {
        "category": "At Risk",
        "riskFactor": "Critical failure in Data Structures combined with low attendance.",
        "weakSubject": "Data Structures",
        "mentoringPlan": [
            "Call parents to discuss 60% attendance limit.",
            "Assign to remedial batch for Data Structures.",
            "Monitor weekly progress personally."
        ],
        "strengths": ["Web Development"]
      }
    `;

    // 4. Generate Analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const data = JSON.parse(jsonString);
      res.json(data);
    } catch (e) {
      console.error("JSON Parse Error", e);
      res.json({
         category: "Unknown", 
         riskFactor: "AI analysis failed to format. Raw: " + text.substring(0, 50),
         mentoringPlan: ["Review manual records"]
      });
    }

  } catch (error) {
    console.error("Faculty AI Error:", error);
    res.status(500).json({ message: "AI Analyst Unavailable" });
  }
};
