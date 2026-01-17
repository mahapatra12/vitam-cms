
# VITAM College Management System - System Documentation

## 1. Executive Summary
The VITAM College Management System (CMS) is an advanced, AI-integrated educational ERP designed to modernize campus administration. Aligned with the **National Education Policy (NEP) 2020**, it emphasizes personalized learning, digital governance, and outcome-based education (OBE) through Artificial Intelligence.

## 2. System Architecture
The system follows a **Micro-Service inspired Monolithic Architecture** using the MERN Stack.

### 2.1 Technology Stack
*   **Layer 1: Interface (Frontend)**
    *   Framework: React 19 (Vite)
    *   Design: Glassmorphism / VisionOS UI
*   **Layer 2: Intelligence (AI)**
    *   Engine: Google Gemini 1.5 Pro
    *   Agents: VITAM Buddy (Student), Faculty Risk Analyst
*   **Layer 3: Logic (Backend)**
    *   Runtime: Node.js / Express
    *   Security: JWT + Speakeasy (3FA)
*   **Layer 4: Data (Storage)**
    *   Database: MongoDB (NoSQL)

## 3. Advanced AI Modules ("VITAM Intelligence")

### 3.1 VITAM Buddy (Student AI Agent)
*   **Context-Aware Chat**: Remembers student history across sessions.
*   **Real-time Access**: Queries live marks/attendance DB.
*   **Personality**: Encouraging, mentor-like persona.

### 3.2 Career Mapping Engine
*   **Skill Extraction**: Automatically tags courses with skills (e.g., CS201 -> 'Algorithms').
*   **Job Matching**: Compares student skill sets with industry roles (Frontend, Backend, DevOps).
*   **Gap Analysis**: Identifies missing skills and suggests elective courses.

### 3.3 Faculty Risk Analyst
*   **Predictive Modeling**: Identifies "At-Risk" students based on attendance trends and mid-term marks.
*   **Mentoring Plans**: Auto-generates remedial actions for faculty.

## 4. NEP 2020 Alignment
*   **Personalized Learning**: AI Roadmaps adapt to student pace.
*   **Holistic Assessment**: 360-degree view (Marks + Skills + Attendance).
*   **Digital Infrastructure**: Paperless administration and automated governance.

## 5. Security & Access Control
*   **3-Factor Authentication (3FA)**: Password + Email OTP + Time-based OTP (Authenticator App).
*   **RBAC**: Strict role separation (Super Admin, HOD, Faculty, Student).

## 6. Viva Voce Questions & Answers

**Q1: How does your AI differ from a standard chatbot?**
*A1: Standard chatbots are static. VITAM Buddy has "Context Injection" - it reads the specific user's database records (attendance, marks) before answering, making it a personalized academic counselor.*

**Q2: How do you handle Data Privacy?**
*A2: We use JWT for session security and bcrypt for password hashing. AI analysis is done on anonymized or session-specific contexts, and no student PII is trained into the public model.*

**Q3: Explain the "Job Readiness Score" logic.**
*A3: It is a weighted algorithm that maps completed course credits and grades to required skills for specific job roles. High grades in relevant subjects increase the score.*

**Q4: Why MongoDB over SQL?**
*A4: Educational data is hierarchical and flexible (e.g., varying course structures). MongoDB's document model fits this better and allows faster iteration for AI data schemas.*

**Q5: How does this support NEP 2020?**
*A5: It enables "Outcome Based Education" by tracking skills rather than just marks, and facilitates the "Academic Bank of Credits" concept through digital tracking.*
