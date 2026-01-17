# VITAM College Management System (CMS) & AI Smart Campus

## 🎓 Project Overview
A comprehensive, industrial-grade College Management System built with the MERN stack, featuring **Advanced AI Agents**, **3-Factor Authentication**, and a **VisionOS-inspired UI**.

---

## 🚀 Key Features

### 🤖 AI Smart Campus (New!)
*   **AI Chat Assistant (Gemini 1.5 Pro)**: A context-aware chatbot available 24/7 to answer student and faculty queries.
    *   *Real-time Data*: Knows your attendance, marks, and fees instantly.
    *   *Visual Avatar*: Animated Lottie robot personality.
*   **Student Career AI**:
    *   **Job Readiness Score**: Analyzes academic performance to score employability.
    *   **Skill Gap Analysis**: Identifies missing skills (e.g., "Weak in Data Structures").
    *   **Strategic Action Plan**: Generates personalized learning roadmaps.
*   **Faculty AI Analytics**:
    *   **Student Risk Assessment**: Predicts at-risk students based on historical data.
    *   **Mentoring Plans**: Auto-generates guidance strategies for teachers.

### 🔐 Authentication & Security
- **3-Layer Multi-Factor Authentication (3FA)**
  - SMS OTP Verification
  - Email OTP Verification
  - Authenticator App (TOTP) Verification
- **Role-Based Access Control (RBAC)**: Super Admin, Admin, HOD, Faculty, Student, Alumni.
- **No Public Registration**: Secure, admin-controlled user creation.

### 📊 Core Modules
*   **Admin Dashboard**: User management, System logs, Department control.
*   **HOD Dashboard**: Faculty oversight, Academic reporting.
*   **Faculty Dashboard**: Attendance marking, Marks entry, AI Student Analytics.
*   **Student Dashboard**: Fee payments, Results, Career Guidance, Timetable.

---

## 🛠️ Tech Stack

### AI & Intelligence
*   **Google Gemini 1.5 Pro** - LLM Engine
*   **Lottie React** - Animated Avatars
*   **Markdown** - Rich Text Responses

### Frontend
- **React 19** - UI Framework
- **Vite** - Build Tool
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Node.js & Express** - Server
- **MongoDB & Mongoose** - Database
- **JWT & Bcrypt** - Security
- **Speakeasy** - TOTP 2FA

---

## 📦 Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd vitam-cms
    ```

2.  **Install Dependencies**
    ```bash
    # Server
    cd server
    npm install
    
    # Client
    cd ../client
    npm install
    ```

3.  **Environment Setup**
    Create `server/.env`:
    ```env
    MONGO_URI=mongodb://localhost:27017/vitam-cms
    JWT_SECRET=your_super_secret_jwt_key_here
    GEMINI_API_KEY=your_google_gemini_api_key
    PORT=5000
    ```

4.  **Seed Database (Vital for AI)**
    This populates the DB with students, courses, marks, and attendance data so the AI has something to analyze.
    ```bash
    cd server
    node seed.js               # Basic Users
    node seed-academic-data.js # Academic Data (Marks/attendance)
    ```

5.  **Start the Application**
    *   **Server**: `cd server && npm start`
    *   **Client**: `cd client && npm run dev`

---

## 🧪 How to Test AI Features

### 1. Student Career Advisor
1.  Login as **Student** (`student@vitam.edu.in` / `Password@123`).
2.  Click **"Career Guidance"** in the sidebar.
3.  The AI will analyze your (seeded) marks and give you a **Job Readiness Score**.

### 2. AI Chat Assistant
1.  Login as **Any User**.
2.  Click the **Robot Icon** (bottom right).
3.  Ask: *"What is my attendance?"* or *"Do I have pending fees?"*.

### 3. Faculty Student Analytics
1.  Login as **Faculty** (`faculty@vitam.edu.in` / `Password@123`).
2.  Click **"AI Analytics"** in the Quick Actions.
3.  Enter a Student ID (e.g., copy from the database or user list).
4.  The AI will generate a **Risk Report** and **Mentoring Plan**.

---

## 📂 Project Structure (AI Enhanced)

```
vitam-cms/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── AIChatWidget.jsx       # Global Chatbot
│   │   ├── pages/Dashboard/
│   │   │   ├── Student/
│   │   │   │   └── StudentCareer.jsx  # Career AI Dashboard
│   │   │   ├── Faculty/
│   │   │   │   └── StudentAnalytics.jsx # Faculty AI Tool
│
├── server/
│   ├── controllers/
│   │   ├── aiController.js            # Chat Logic
│   │   ├── careerController.js        # Career Logic
│   │   └── facultyAIController.js     # Faculty Logic
│   ├── routes/                        # AI Routes
│   ├── seed-academic-data.js          # AI Data Seeder
```

---

## 📄 License
This project is built for the **VITAM College of Engineering** Major Project.
