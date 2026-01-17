const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Mark = require('../models/Mark');
const Fee = require('../models/Fee');
const ChatHistory = require('../models/ChatHistory');
const Course = require('../models/Course'); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithAI = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user.id;
    
    if (!message) return res.status(400).json({ message: "Message is required" });
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ message: "Gemini API Key missing." });

    // 1. Fetch User data
    const user = await User.findById(userId).populate('department');

    // 2. Manage Persistent Session
    let chatSession;
    if (sessionId) {
      chatSession = await ChatHistory.findOne({ _id: sessionId, user: userId });
    }
    if (!chatSession) {
      chatSession = await ChatHistory.create({
        user: userId,
        sessionTitle: message.substring(0, 30) + "...",
        messages: []
      });
    }

    // 3. Build "DEEP" Student Context (The "Mentor" Brain)
    let context = `
      You are "VITAM Buddy", a dedicated AI Mentor for this student.
      
      STUDENT IDENTITY:
      Name: ${user.name} | Role: ${user.role} | Year: ${user.year || 'N/A'}
      Dept: ${user.department ? user.department.name : 'Engineering'}
    `;

    if (user.role === 'student') {
        const attendance = await Attendance.find({ student: userId }).populate('course');
        const marks = await Mark.find({ student: userId }).populate('course');
        
        let weakSubjects = [];
        let strongSubjects = [];
        let backlogs = [];

        marks.forEach(m => {
           if(m.course) {
               const pct = (m.marksObtained / m.maxMarks) * 100;
               if (pct < 40) backlogs.push(m.course.name);
               else if (pct < 60) weakSubjects.push(m.course.name);
               else if (pct > 80) strongSubjects.push(m.course.name);
           }
        });

        // Skill extraction from strong subjects
        let inferredSkills = strongSubjects.map(sub => {
            if (sub.includes('Web')) return 'Web Development';
            if (sub.includes('Data')) return 'Algorithmic Logic';
            if (sub.includes('System')) return 'System Architecture';
            return sub + ' Mastery';
        });

        context += `
          ACADEMIC REALITY:
          - Strengths: ${strongSubjects.join(', ') || 'None identified yet'}
          - Weaknesses: ${weakSubjects.join(', ') || 'None identified'}
          - Backlogs/Failures: ${backlogs.length > 0 ? backlogs.join(', ') : 'None! (Great job)'}
          - Inferred Skills: ${inferredSkills.join(', ')}
        `;
    }

    // 4. Configure The "Examiner-Proof" Mentor Persona
    const systemPrompt = `
      ${context}

      YOUR PERMANENT IDENTITY:
      - Name: VITAM Buddy
      - Role: Exclusive AI Mentor for VITAM College of Engineering.
      - Created By: The VITAM Final Year Project Team.
      - Model Source: DO NOT mention Gemini/Google/OpenAI. If asked, say "I am a custom AI architecture built for this university."

      STRICT GUARDRAILS (Examiner-Proofing):
      1.  **Scope**: Only answer questions related to Engineering, Career, Campus, Studies, and Skills.
          - If asked about movies/politics/jokes: "I prefer to stay focused on your academic success! 🎓"
      2.  **Identity**: NEVER break character. You are NOT a generic chatbot. You are a campus companion.
      3.  **Data-Driven**: Always reference the student's *actual data* when possible. 
          - Bad: "You should study more."
          - Good: "Since your Data Structures score is 35%, I recommend starting there."

      CAPABILITIES:
      1. "How should I study?": Prioritize their [Weaknesses] and [Backlogs] first.
      2. "What career suits me?": Link [Strengths] to Job Roles.
      3. "I failed": Be empathetic but strategic (Backlog Recovery).
      4. "Viva Prep": If asked technical questions, give a brief, precise answer suitable for a viva student.

      Your goal is to impress the external examiner with how *personalized* and *professional* you are.
    `;

    // 5. Generate Response
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // History Management
    let historyForGemini = [];
    if (chatSession.messages && chatSession.messages.length > 0) {
        historyForGemini = chatSession.messages.slice(-10).map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));
    }

    const chat = model.startChat({
      history: historyForGemini,
      systemInstruction: systemPrompt
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // 6. Save Memory
    chatSession.messages.push({ role: 'user', text: message });
    chatSession.messages.push({ role: 'model', text: responseText });
    chatSession.lastActive = Date.now();
    await chatSession.save();

    res.json({ reply: responseText, sessionId: chatSession._id });

  } catch (error) {
    console.error("Reader Error:", error);
    res.status(500).json({ message: "My brain is upgrading... try again in a sec!" });
  }
};
