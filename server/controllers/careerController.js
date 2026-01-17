const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/User');
const Mark = require('../models/Mark');
const Course = require('../models/Course'); // Now has skills!

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 1. Fetch User's Completed Courses & Marks
    const marks = await Mark.find({ student: userId }).populate('course');
    
    // 2. Extract Acquired Skills
    let acquiredSkills = new Set();
    let coursePerformance = [];

    marks.forEach(m => {
       if (m.course && m.course.skills) {
          // If passed (assuming > 40% marks), they have the skill
          const percentage = (m.marksObtained / m.maxMarks) * 100;
          if (percentage >= 40) {
              m.course.skills.forEach(s => acquiredSkills.add(s));
          }
          coursePerformance.push({
              course: m.course.name,
              score: percentage,
              skills: m.course.skills
          });
       }
    });

    const skillList = Array.from(acquiredSkills);

    // 3. Define Industry Roles (Knowledge Base)
    // In a real app, this might come from a DB, but for the "Engine", we provide it to Gemini
    const systemPrompt = `
       You are an Expert Career Architect using the NEP 2020 framework.
       
       STUDENT SKILL INVENTORY:
       ${JSON.stringify(skillList)}
       
       COURSE PERFORMANCE:
       ${JSON.stringify(coursePerformance)}
       
       TASK:
       1. ANALYZE: Match current skills to 3 top industry roles.
       2. GAP ANALYSIS: What skills are missing for these roles?
       3. ROADMAP: Suggest a 4-step learning path (Courses/Projects) to bridge the gap.
       
       OUTPUT FORMAT (Specific JSON):
       {
         "roles": [
           { 
             "title": "Frontend Developer", 
             "match": 75, 
             "missingSkills": ["Redux", "Testing"],
             "why": "Strong in React and HTML/CSS from Web Dev course."
           }
         ],
         "roadmap": [
           { "step": 1, "action": "Learn Redux", "resource": "Official Docs / Youtube" },
           { "step": 2, "action": "Build E-commerce Project", "resource": "Self-Paced" }
         ],
         "verdict": "Your strong foundation in Web Dev makes you a prime candidate for Frontend roles, but Data Structures scores suggest avoiding heavy Backend logic for now."
       }
    `;

    // 4. Generate Analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
       const data = JSON.parse(jsonString);
       res.json(data);
    } catch (e) {
       console.error("JSON Parse Fail", e);
       // Fallback
       res.json({
         roles: [], 
         roadmap: [], 
         verdict: "Could not parse AI analysis. Raw: " + text.substring(0, 100)
       });
    }

  } catch (error) {
    console.error("Roadmap Engine Error:", error);
    res.status(500).json({ message: "Engine Failure" });
  }
};
