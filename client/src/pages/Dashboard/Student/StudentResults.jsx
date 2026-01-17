import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../../components/Card';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import './StudentResults.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('all');
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/academic/my-results`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(response.data);
    } catch (error) {
      showToast('Failed to fetch results', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', points: 10 };
    if (percentage >= 80) return { grade: 'A', points: 9 };
    if (percentage >= 70) return { grade: 'B+', points: 8 };
    if (percentage >= 60) return { grade: 'B', points: 7 };
    if (percentage >= 50) return { grade: 'C', points: 6 };
    if (percentage >= 40) return { grade: 'D', points: 5 };
    return { grade: 'F', points: 0 };
  };

  const groupedResults = results.reduce((acc, result) => {
    const semester = result.course?.semester || 'Unknown';
    if (!acc[semester]) acc[semester] = [];
    acc[semester].push(result);
    return acc;
  }, {});

  const filteredSemesters = selectedSemester === 'all' 
    ? Object.keys(groupedResults).sort((a, b) => a - b)
    : [selectedSemester];

  const calculateSemesterStats = (semesterResults) => {
    const totalMarks = semesterResults.reduce((sum, r) => sum + r.marksObtained, 0);
    const totalMax = semesterResults.reduce((sum, r) => sum + r.maxMarks, 0);
    const percentage = totalMax > 0 ? (totalMarks / totalMax) * 100 : 0;
    const { grade, points } = calculateGrade(percentage);
    
    return { totalMarks, totalMax, percentage, grade, points };
  };

  if (loading) {
    return (
      <div className="student-results">
        <Card title="My Results">
          <div className="loading-state">Loading results...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="student-results">
      <Card 
        title="My Results" 
        subtitle="View your academic performance"
        actions={
          <select 
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="semester-filter"
          >
            <option value="all">All Semesters</option>
            {Object.keys(groupedResults).sort((a, b) => a - b).map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
        }
      >
        {filteredSemesters.length > 0 ? (
          <div className="results-container">
            {filteredSemesters.map(semester => {
              const semesterResults = groupedResults[semester];
              const stats = calculateSemesterStats(semesterResults);

              return (
                <div key={semester} className="semester-section">
                  <div className="semester-header">
                    <h3>Semester {semester}</h3>
                    <div className="semester-stats">
                      <div className="stat-item">
                        <span className="stat-label">Percentage</span>
                        <span className="stat-value">{stats.percentage.toFixed(2)}%</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Grade</span>
                        <span className={`stat-value grade-${stats.grade.toLowerCase().replace('+', 'plus')}`}>
                          {stats.grade}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">SGPA</span>
                        <span className="stat-value">{stats.points.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="results-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Code</th>
                          <th>Exam Type</th>
                          <th>Marks</th>
                          <th>Percentage</th>
                          <th>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semesterResults.map((result, index) => {
                          const percentage = (result.marksObtained / result.maxMarks) * 100;
                          const { grade } = calculateGrade(percentage);

                          return (
                            <tr key={index}>
                              <td className="subject-name">{result.course?.name || 'N/A'}</td>
                              <td className="subject-code">{result.course?.code || 'N/A'}</td>
                              <td className="exam-type">{result.examType}</td>
                              <td className="marks">
                                {result.marksObtained} / {result.maxMarks}
                              </td>
                              <td className="percentage">{percentage.toFixed(1)}%</td>
                              <td>
                                <span className={`grade-badge grade-${grade.toLowerCase().replace('+', 'plus')}`}>
                                  {grade}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <p>No results available yet.</p>
            <p className="empty-subtitle">Results will appear here once your exams are graded.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentResults;
