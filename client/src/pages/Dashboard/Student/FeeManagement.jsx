import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import './FeeManagement.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/fees/my-fees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFees(response.data);
    } catch (error) {
      showToast('Failed to fetch fees', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (feeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/fees/${feeId}/pay`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Payment successful!', 'success');
      fetchFees();
    } catch (error) {
      showToast(error.response?.data?.message || 'Payment failed', 'error');
    }
  };

  const getTotalFees = () => fees.reduce((sum, fee) => sum + fee.amount, 0);
  const getPaidFees = () => fees.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0);
  const getPendingFees = () => fees.filter(f => f.status === 'Pending').reduce((sum, fee) => sum + fee.amount, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="fee-management">
        <Card title="Fee Management">
          <div className="loading-state">Loading fees...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fee-management">
      <Card title="Fee Management" subtitle="View and pay your fees">
        <div className="fee-summary">
          <div className="summary-card">
            <div className="summary-icon total">💰</div>
            <div className="summary-content">
              <span className="summary-label">Total Fees</span>
              <span className="summary-value">₹{getTotalFees().toLocaleString()}</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon paid">✅</div>
            <div className="summary-content">
              <span className="summary-label">Paid</span>
              <span className="summary-value success">₹{getPaidFees().toLocaleString()}</span>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon pending">⏳</div>
            <div className="summary-content">
              <span className="summary-label">Pending</span>
              <span className="summary-value warning">₹{getPendingFees().toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="fees-list">
          {fees.length > 0 ? (
            fees.map(fee => (
              <div key={fee._id} className={`fee-card ${fee.status.toLowerCase()}`}>
                <div className="fee-header">
                  <div className="fee-info">
                    <h3 className="fee-type">{fee.type}</h3>
                    <span className="fee-semester">Semester {fee.semester}</span>
                  </div>
                  <div className="fee-amount">₹{fee.amount.toLocaleString()}</div>
                </div>
                
                <div className="fee-details">
                  <div className="detail-item">
                    <span className="detail-label">Due Date:</span>
                    <span className="detail-value">
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  {fee.paymentDate && (
                    <div className="detail-item">
                      <span className="detail-label">Paid On:</span>
                      <span className="detail-value">
                        {new Date(fee.paymentDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {fee.transactionId && (
                    <div className="detail-item">
                      <span className="detail-label">Transaction ID:</span>
                      <span className="detail-value transaction-id">{fee.transactionId}</span>
                    </div>
                  )}
                </div>

                <div className="fee-footer">
                  <span className={`status-badge ${getStatusColor(fee.status)}`}>
                    {fee.status}
                  </span>
                  {fee.status === 'Pending' && (
                    <Button 
                      size="sm" 
                      variant="primary"
                      onClick={() => handlePayment(fee._id)}
                    >
                      Pay Now
                    </Button>
                  )}
                  {fee.status === 'Paid' && (
                    <Button size="sm" variant="ghost">
                      Download Receipt
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No fee records found.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FeeManagement;
