import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuality } from '../hooks/useQuality';
import MRHeader from '../components/MRHeader';
import GatePassPreview from '../components/GatePassPreview';

export default function QualityReport() {
  const navigate = useNavigate();
  const { inspectionId } = useParams();
  const location = useLocation();
  const { getInspectionReport, loading, error, clearError } = useQuality();

  const [inspectionData, setInspectionData] = useState(location.state?.inspectionData || null);
  const [mrData, setMrData] = useState(location.state?.mrData || null);
  const [gatePassData, setGatePassData] = useState(null);

  useEffect(() => {
    const initializeData = () => {
      if (location.state?.inspectionData && location.state?.mrData) {
        const inspection = location.state.inspectionData;
        const mr = location.state.mrData;

        setInspectionData(inspection);
        setMrData(mr);

        // Generate gate pass data from accepted items only
        const acceptedItems = (inspection.items || []).filter(
          item => item.accepted_quantity > 0
        );

        const gatePass = {
          gate_pass_number: generateGatePassNumber(),
          mr_number: mr.mr_number,
          po_number: mr.po_number,
          vendor_name: mr.vendor_name,
          items: acceptedItems,
          issued_by: inspection.inspector_name || 'Quality Inspector',
          issued_date: new Date().toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        };

        setGatePassData(gatePass);
      }
    };

    initializeData();
  }, [location.state]);

  const generateGatePassNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `GP-${timestamp}-${random}`;
  };

  const getInspectionStatus = () => {
    if (!inspectionData || !inspectionData.items) return 'UNKNOWN';

    const items = inspectionData.items;
    const totalItems = items.length;
    const fullyAccepted = items.filter(
      item => item.rejected_quantity === 0 && item.accepted_quantity > 0
    ).length;
    const partiallyAccepted = items.filter(
      item => item.rejected_quantity > 0 && item.accepted_quantity > 0
    ).length;

    if (fullyAccepted === totalItems) return 'FULLY_ACCEPTED';
    if (partiallyAccepted > 0 || (fullyAccepted > 0 && fullyAccepted < totalItems)) {
      return 'PARTIALLY_ACCEPTED';
    }
    return 'REJECTED';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'FULLY_ACCEPTED':
        return '#10b981';
      case 'PARTIALLY_ACCEPTED':
        return '#f59e0b';
      case 'REJECTED':
        return '#ef4444';
      default:
        return '#6b7280';
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

  const sectionStyle = {
    marginBottom: '32px',
  };

  const statusBadgeStyle = {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: getStatusColor(getInspectionStatus()),
    color: 'white',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '24px',
  };

  const reportContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    padding: '20px',
    marginBottom: '24px',
  };

  const reportGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e5e7eb',
  };

  const reportFieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const valueStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937',
  };

  const tableContainerStyle = {
    overflow: 'hidden',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    marginBottom: '24px',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle = {
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '2px solid #d1d5db',
    fontWeight: '600',
    fontSize: '13px',
    color: '#374151',
    backgroundColor: '#f9fafb',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const tdStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#1f2937',
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
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

  const handleDispatchToStore = () => {
    if (gatePassData) {
      navigate('/store', {
        state: { gatePassData, inspectionData, mrData },
      });
    }
  };

  const statusText = {
    FULLY_ACCEPTED: 'FULLY ACCEPTED',
    PARTIALLY_ACCEPTED: 'PARTIALLY ACCEPTED',
    REJECTED: 'REJECTED',
  };

  if (!inspectionData || !mrData) {
    return (
      <div style={containerStyle}>
        <h1 style={headingStyle}>Quality Report</h1>
        <div style={reportContainerStyle}>
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '32px' }}>
            <p>No inspection data available. Please complete an inspection first.</p>
          </div>
        </div>
      </div>
    );
  }

  const status = getInspectionStatus();

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Quality Inspection Report</h1>

      {error && (
        <div style={errorAlertStyle}>
          <span>{error}</span>
          <span style={closeErrorStyle} onClick={clearError}>✕</span>
        </div>
      )}

      <div style={statusBadgeStyle}>
        {statusText[status] || 'UNKNOWN'}
      </div>

      <div style={sectionStyle}>

        {validationError && (
          <div style={{
            background: '#fee2e2',
            color: '#7f1d1d',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
          }}>
            {validationError}
          </div>
        )}

        <MRHeader mrData={mrData} isReadOnly={true} />
      </div>

      <div style={sectionStyle}>
        <div style={reportContainerStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Inspection Details
          </h2>
          <div style={reportGridStyle}>
            <div style={reportFieldStyle}>
              <div style={labelStyle}>Inspector Name</div>
              <div style={valueStyle}>{inspectionData.inspector_name || '-'}</div>
            </div>
            <div style={reportFieldStyle}>
              <div style={labelStyle}>Inspection Date</div>
              <div style={valueStyle}>
                {inspectionData.inspection_date
                  ? new Date(inspectionData.inspection_date).toLocaleDateString('en-IN')
                  : new Date().toLocaleDateString('en-IN')}
              </div>
            </div>
            <div style={reportFieldStyle}>
              <div style={labelStyle}>Status</div>
              <div style={{ ...valueStyle, color: getStatusColor(status) }}>
                {statusText[status]}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
          Inspection Items
        </h2>
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Item Code</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Unit</th>
                <th style={thStyle}>Received</th>
                <th style={thStyle}>Accepted</th>
                <th style={thStyle}>Rejected</th>
                <th style={thStyle}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {inspectionData.items && inspectionData.items.length > 0 ? (
                inspectionData.items.map((item, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>{item.item_code || '-'}</td>
                    <td style={tdStyle}>{item.description || '-'}</td>
                    <td style={tdStyle}>{item.unit || '-'}</td>
                    <td style={tdStyle}>{item.received_quantity || 0}</td>
                    <td style={tdStyle}>
                      <span style={{ color: '#10b981', fontWeight: '500' }}>
                        {item.accepted_quantity || 0}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: '#ef4444', fontWeight: '500' }}>
                        {item.rejected_quantity || 0}
                      </span>
                    </td>
                    <td style={tdStyle}>{item.remarks || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {status === 'FULLY_ACCEPTED' || status === 'PARTIALLY_ACCEPTED' ? (
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
            Gate Pass
          </h2>
          {gatePassData && <GatePassPreview gatePassData={gatePassData} onDispatch={handleDispatchToStore} />}
        </div>
      ) : (
        <div style={reportContainerStyle}>
          <p style={{ color: '#6b7280', textAlign: 'center' }}>
            No gate pass available. All items were rejected.
          </p>
        </div>
      )}

      <div style={actionButtonsStyle}>
        <button onClick={() => navigate('/quality')} style={cancelButtonStyle}>
          Back to Quality
        </button>
      </div>
    </div>
  );
}
