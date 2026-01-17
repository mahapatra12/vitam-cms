# VITAM CMS - AI System Flowcharts

This document serves as the **Record Notebook diagrams** for your project. You can draw these exactly as shown or take screenshots of rendered Mermaid diagrams.

## 1. Student AI Agent - Academic Analysis Flowchart
**Purpose:** Analyze student academic data and guide learning.

```mermaid
flowchart TD
    Start([START]) --> StudentLogin[Student Login MFA Verified]
    StudentLogin --> FetchID[Fetch Student ID]
    FetchID --> CollectData[Collect Academic Data\nAttendance & Marks]
    CollectData --> AnalyzeAtt{Attendance < 75%?}
    
    AnalyzeAtt -- YES --> Warning[Generate Warning +\nSuggest Recovery Plan]
    AnalyzeAtt -- NO --> AnalyzeMarks[Analyze Subject-wise Marks]
    
    Warning --> AnalyzeMarks
    
    AnalyzeMarks --> PerfDrop{Performance Dropping?}
    PerfDrop -- YES --> IdentifyWeak[Identify Weak Subjects]
    PerfDrop -- NO --> Stable[Mark as Stable]
    
    IdentifyWeak --> StudyPlan[Generate Study Plan]
    Stable --> StudyPlan
    
    StudyPlan --> Display[Display AI Suggestions to Student]
    Display --> End([END])
```

## 2. Career Guidance AI Flowchart
**Purpose:** Guide students from learning to job placement.

```mermaid
flowchart TD
    Start([START]) --> FetchProfile[Fetch Student Profile]
    FetchProfile --> CollectStats[Collect Data\nMarks, Skills, Projects]
    CollectStats --> AnalyzeSkills[Analyze Skill Set]
    AnalyzeSkills --> CompareJobs[Compare with Industry Roles]
    
    CompareJobs --> GapFound{Skill Gap Found?}
    GapFound -- YES --> Recommend[Recommend Courses & Practice]
    GapFound -- NO --> EvalScore[Evaluate Job Readiness Score]
    
    Recommend --> EvalScore
    
    EvalScore --> IsReady{Is Job Ready?}
    IsReady -- YES --> SuggestJobs[Suggest Internships / Jobs]
    IsReady -- NO --> SuggestRoadmap[Suggest Skill Roadmap]
    
    SuggestJobs --> Report[Generate Career Report]
    SuggestRoadmap --> Report
    
    Report --> End([END])
```

## 3. Faculty AI Agent - Student Guidance
**Purpose:** Help faculty guide students based on data classification.

```mermaid
flowchart TD
    Start([START]) --> FacLogin[Faculty Login MFA Verified]
    FacLogin --> SelectStudent[Select Student by ID]
    SelectStudent --> FetchData[Fetch Student Academic + Career Data]
    FetchData --> Classify[Classify Student\nWeak / Average / Strong]
    
    Classify --> IsWeak{Is Student Weak?}
    IsWeak -- YES --> Plan[Suggest Academic + Career Guidance Plan]
    IsWeak -- NO --> Insight[Generate AI Student Insight Report]
    
    Plan --> Display[Display Guidance Strategy]
    Insight --> Display
    
    Display --> End([END])
```

## 4. Admin AI Agent - Institutional Statistics
**Purpose:** Provide complete control and analytics to the Administrator.

```mermaid
flowchart TD
    Start([START]) --> AdminLogin[Admin Login MFA Verified]
    AdminLogin --> CollectInst[Collect Institutional Data\nStudents, Faculty, Depts]
    CollectInst --> AnalyzeDept[Analyze Dept-wise Performance]
    
    AnalyzeDept --> Underperf{Department Underperforming?}
    Underperf -- YES --> Reassign[Suggest Faculty Reassignment]
    Underperf -- NO --> SalAnalyze[Analyze Salary Expenditure]
    
    Reassign --> SalAnalyze
    
    SalAnalyze --> GenReport[Generate Admin AI Report]
    GenReport --> Display[Display Strategic Suggestions]
    Display --> End([END])
```

## 5. MFA & Secure Login Flowchart
**Purpose:** Secure authentication workflow.

```mermaid
flowchart TD
    Start([START]) --> EnterCreds[User Enters Email & Password]
    EnterCreds --> Validate{Credentials Valid?}
    
    Validate -- NO --> Reject[Reject Login]
    Validate -- YES --> SendOTP[Send OTP via Email/SMS]
    
    SendOTP --> EnterOTP[User Enters OTP]
    EnterOTP --> CheckOTP{OTP Valid?}
    
    CheckOTP -- NO --> Block[Retry / Block]
    CheckOTP -- YES --> GenToken[Generate JWT Token]
    
    GenToken --> Redirect[Redirect to Role Dashboard]
    Redirect --> End([END])
```
