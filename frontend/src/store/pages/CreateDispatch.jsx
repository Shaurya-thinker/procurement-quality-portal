import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import MaterialDispatchForm from '../components/MaterialDispatchForm';
import axios from 'axios';

export default function CreateDispatch() {
  const navigate = useNavigate();
  const { loading } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (payload) => {
    setErrorMessage('');
    setSuccessMessage('');
    setSubmitting(true);
    
    console.log('[CREATE DISPATCH] Submitting material dispatch:', payload);
    
    try {
      // Add 10 second timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const apiCall = axios.post('http://localhost:8000/api/v1/store/material-dispatch', payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      
      const response = await Promise.race([apiCall, timeoutPromise]);
      console.log('[CREATE DISPATCH] Success:', response.data);
      
      const action = payload.action === 'DRAFT' ? 'saved as draft' : 'issued successfully';
      setSuccessMessage(`Material dispatch ${action}! Dispatch #${response.data.dispatch_number}`);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/store/dispatches');
      }, 2000);
      
    } catch (err) {
      console.error('[CREATE DISPATCH] Failed:', err);
      
      let errorMsg = 'Failed to create material dispatch';
      
      if (err.message === 'Request timeout') {
        errorMsg = 'Request timed out. Please try again.';
      } else if (err.response?.data?.detail) {
        errorMsg = Array.isArray(err.response.data.detail) 
          ? err.response.data.detail.map(e => e.msg || e).join(', ')
          : err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const containerStyle = {
    padding: '24px',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  };

  const headerStyle = {
    marginBottom: '24px',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px',
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: '#6b7280',
  };

  const successStyle = {
    padding: '16px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '6px',
    marginBottom: '16px',
    fontWeight: '500',
  };

  const errorStyle = {
    padding: '16px',
    backgroundColor: '#fee2e2',
    color: '#7f1d1d',
    borderRadius: '6px',
    marginBottom: '16px',
    fontWeight: '500',
  };

  return (
    <div style={containerStyle}>
      <div style={{ ...headerStyle, display: 'flex', alignItems: 'center', gap: '12px' }}>
  <button
    onClick={() => navigate(-1)}
    className="back-arrow-btn"
    aria-label="Go back"
  >
    ←
  </button>

  <div>
    <h1 style={titleStyle}>Create Material Dispatch</h1>
    <p style={subtitleStyle}>
      Issue materials from inventory with comprehensive tracking
    </p>
  </div>
</div>


      {successMessage && <div style={successStyle}>{successMessage}</div>}
      {errorMessage && <div style={errorStyle}>{errorMessage}</div>}

      <MaterialDispatchForm
        onSubmit={handleSubmit}
        loading={submitting || loading}
      />
    </div>
  );
}
