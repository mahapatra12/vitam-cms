import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, TrendingUp, FileText } from 'lucide-react';
import './ExamResults.css';

const ExamResults = () => {
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({ cgpa: 0, totalCredits: 0 });

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/results`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data.results || []);
      setSummary(res.data.summary || { cgpa: 0, totalCredits: 0 });
    } catch (error) {
      console.error('Error fetching results', error);
    }
  };

  return (
    <div className="exam-results ios-app-container">
      <h2 className="ios-section-title">My Results</h2>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card ios-card blue-gradient">
          <div className="card-icon">
            <Award size={24} />
          </div>
          <div className="card-content">
            <h3>CGPA</h3>
            <p className="big-number">{summary.cgpa.toFixed(2)}</p>
          </div>
        </div>

        <div className="summary-card ios-card purple-gradient">
          <div className="card-icon">
            <TrendingUp size={24} />
          </div>
          <div className="card-content">
            <h3>Credits Earned</h3>
            <p className="big-number">{summary.totalCredits}</p>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="results-table-container ios-card">
        <div className="table-header">
          <FileText size={20} />
          <span>Semester Results</span>
        </div>

        <table className="results-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Code</th>
              <th>Mid-1</th>
              <th>Mid-2</th>
              <th>Semester</th>
              <th>Total</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => (
              <tr key={idx}>
                <td>{result.subject}</td>
                <td>{result.code}</td>
                <td>{result.mid1 || '-'}</td>
                <td>{result.mid2 || '-'}</td>
                <td>{result.semester || '-'}</td>
                <td className="total-marks">{result.total || '-'}</td>
                <td>
                  <span className={`grade-badge grade-${result.grade}`}>
                    {result.grade || 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamResults;
