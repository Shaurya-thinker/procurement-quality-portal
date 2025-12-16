import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuality } from '../hooks/useQuality';
import MRHeader from '../components/MRHeader';
import InspectionSummary from '../components/InspectionSummary';

export default function Inspection() {
  const navigate = useNavigate();
  const { mrNumber } = useParams();
  const location = useLocation();
  const { inspectMaterial, loading, error, clearError } = useQuality();

  const [mrData, setMrData] = useState(location.state?.mrData || null);
  const [inspectionItems, setInspectionItems] = useState([]);
  const [inspectorName, setInspectorName] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (location.state?.mrData) {
      const mr = location.state.mrData;
      setMrData(mr);
      
      // Initialize inspection items from material receipt
      const items = (mr.line_items || []).map(item => ({
        ...item,
        accepted_quantity: '',
        rejected_quantity: '',
        remarks: '',
      }));
      setInspectionItems(items);
    }
  }, [location.state]);

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

  const sectionStyle = {
    marginBottom: '24px',
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px',
  };

  const inspectorSectionStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    padding: '20px',
    marginBottom: '24px',
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxWidth: '400px',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const inputStyle = {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    color: '#1f2937',
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    justifyContent: 'flex-end',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const cancelButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
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

  const closeErrorStyle = {
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const validateInspection = () => {
    setValidationError('');

    if (!inspectorName.trim()) {
      setValidationError('Inspector name is required');
      return false;
    }

    for (let item of inspectionItems) {
      const received = parseInt(item.received_quantity) || 0;
      const accepted = parseInt(item.accepted_quantity) || 0;
      const rejected = parseInt(item.rejected_quantity) || 0;

      if (accepted + rejected !== received) {
        setValidationError(
          `Item ${item.item_code}: Accepted (${accepted}) + Rejected (${rejected}) must equal Received (${received})`
        );
        return false;
      }

      if (accepted === 0 && rejected === 0) {
        setValidationError(`Item ${item.item_code}: Must specify either accepted or rejected quantity`);
        return false;
      }
    }

    return true;
  };

  const handleSubmitInspection = async () => {
    if (!validateInspection()) {
      return;
    }

    try {
      const payload = {
        mr_number: mrData?.mr_number,
        inspector_name: inspectorName,
        items: inspectionItems.map(item => ({
          item_code: item.item_code,
          accepted_quantity: parseInt(item.accepted_quantity) || 0,
          rejected_quantity: parseInt(item.rejected_quantity) || 0,
          remarks: item.remarks || '',
        })),
      };

      const result = await inspectMaterial(payload);

      if (result && result.inspection_id) {
        navigate(`/quality/report/${result.inspection_id}`, {
          state: { inspectionData: result, mrData },
        });
      } else {
        alert('Inspection submitted successfully');
      }
    } catch (err) {
      console.error('Error submitting inspection:', err);
    }
  };

  if (!mrData) {
    return (
      <div style={containerStyle}>
        <h1 style={headingStyle}>Inspection</h1>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          padding: '32px',
          textAlign: 'center',
          color: '#6b7280',
        }}>
          <p>No material receipt data available. Please create a material receipt first.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Material Inspection</h1>

      {(error || validationError) && (
        <div style={errorAlertStyle}>
          <span>{error || validationError}</span>
          <span
            style={closeErrorStyle}
            onClick={() => {
              clearError();
              setValidationError('');
            }}
          >
            ✕
          </span>
        </div>
      )}

      <div style={sectionStyle}>
        <MRHeader mrData={mrData} isReadOnly={true} />
      </div>

      <div style={inspectorSectionStyle}>
        <h2 style={sectionTitleStyle}>Inspection Details</h2>
        <div style={fieldStyle}>
          <label style={labelStyle}>Inspector Name</label>
          <input
            type="text"
            value={inspectorName}
            onChange={(e) => setInspectorName(e.target.value)}
            style={inputStyle}
            placeholder="Enter inspector name"
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Received Items</h2>
        <InspectionSummary items={inspectionItems} onChange={setInspectionItems} />
      </div>

      <div style={actionButtonsStyle}>
        <button onClick={() => navigate('/quality')} style={cancelButtonStyle}>
          Cancel
        </button>
        <button
          onClick={handleSubmitInspection}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Inspection'}
        </button>
      </div>
    </div>
  );
}
