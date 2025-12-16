import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import DispatchForm from '../components/DispatchForm';

export default function Dispatch() {
  const navigate = useNavigate();
  const { getInventory, dispatchMaterial, loading, error, clearError } = useStore();

  const [inventory, setInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoadingInventory(true);
    try {
      const data = await getInventory();
      const itemsArray = Array.isArray(data) ? data : data.data || [];
      setInventory(itemsArray);
    } catch (err) {
      console.error('Error loading inventory:', err);
    } finally {
      setLoadingInventory(false);
    }
  };

  const handleDispatchSubmit = async (dispatchData) => {
    setSuccessMessage('');
    try {
      const result = await dispatchMaterial(dispatchData);
      
      setSuccessMessage('Dispatch submitted successfully');
      
      setTimeout(() => {
        navigate('/store/dispatches', {
          state: { dispatchData: result },
        });
      }, 1500);
    } catch (err) {
      console.error('Error submitting dispatch:', err);
    }
  };

  const containerStyle = {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#1f2937',
  };

  const errorAlertStyle = {
    backgroundColor: '#fee2e2',
    color: '#7f1d1d',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const successAlertStyle = {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const closeButtonStyle = {
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const loadingStyle = {
    padding: '24px',
    textAlign: 'center',
    color: '#6b7280',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Material Dispatch</h1>

      {error && (
        <div style={errorAlertStyle}>
          <span>{error}</span>
          <span style={closeButtonStyle} onClick={clearError}>✕</span>
        </div>
      )}

      {successMessage && (
        <div style={successAlertStyle}>
          <span>{successMessage}</span>
          <span
            style={closeButtonStyle}
            onClick={() => setSuccessMessage('')}
          >
            ✕
          </span>
        </div>
      )}

      {loadingInventory ? (
        <div style={loadingStyle}>Loading inventory...</div>
      ) : inventory.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          padding: '48px 24px',
          textAlign: 'center',
          color: '#6b7280',
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
            No Inventory Available
          </div>
          <p>You need to receive items in inventory before you can create a dispatch.</p>
        </div>
      ) : (
        <DispatchForm
          availableInventory={inventory}
          onSubmit={handleDispatchSubmit}
          loading={loading}
        />
      )}
    </div>
  );
}
