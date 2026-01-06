import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProcurement } from '../hooks/useProcurement';
import POStatusBadge from '../components/POStatusBadge';
import VendorInfoCard from '../components/VendorInfoCard';
import POLineItemRow from '../components/POLineItemRow';
import { getVendorDetails } from '../../api/procurement.api';


const PODetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { 
    fetchPODetails, 
    sendProcurementOrder, 
    cancelProcurementOrder,
    fetchPOTracking, 
    loading, 
    error 
  } = useProcurement();

  const formatDateTime = (dateString) => {
  if (!dateString) return '-';

  const date = new Date(dateString + 'Z'); // 👈 FORCE UTC

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });
};

  const [poData, setPoData] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [sendingPO, setSendingPO] = useState(false);
  const [sendError, setSendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSendConfirm, setShowSendConfirm] = useState(false);

  useEffect(() => {
    loadPOData();
  }, [id]);

  const loadPOData = async () => {
  setLoadingData(true);
  setErrorMessage('');

  try {
    const data = await fetchPODetails(id);

    let vendor = null;
    try {
      const res = await getVendorDetails(data.vendor_id);
      vendor = res.data;
    } catch {
      vendor = {
        name: 'Unknown Vendor',
        status: 'UNKNOWN',
      };
    }

    setPoData({
      ...data,
      vendor,
    });

    if (data.status === 'SENT') {
      loadTracking();
    }
  } catch (err) {
    setErrorMessage(err.response?.data?.message || 'Failed to load PO details');
  } finally {
    setLoadingData(false);
  }
};


  const loadTracking = async () => {
    try {
      const data = await fetchPOTracking(id);
      setTracking(data);
    } catch (err) {
      console.error('Failed to load tracking data:', err);
    }
  };

  const handleSendPO = async () => {
    setSendError('');
    setSendingPO(true);
    try {
      const result = await sendProcurementOrder(id);
      setSuccessMessage('PO sent successfully');
      setPoData({ ...poData, status: 'SENT', po_sent_at: result.po_sent_at, });
      setShowSendConfirm(false);
      loadTracking();
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setSendError(err.response?.data?.message || 'Failed to send PO');
    } finally {
      setSendingPO(false);
    }
  };

  const handleCancelPO = async () => {
  if (!window.confirm('Are you sure you want to cancel this PO?')) return;

  try {
    await cancelProcurementOrder(id);
    setPoData({ ...poData, status: 'CANCELLED' });
    setSuccessMessage('Purchase Order cancelled successfully');
  } catch (err) {
    setSendError(err.response?.data?.detail || 'Failed to cancel PO');
  }
};


  const handleEditPO = () => {
    navigate(`/procurement/${id}/edit`);
  };

  if (loadingData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
        Loading purchase order details...
      </div>
    );
  }

  if (errorMessage && !poData) {
    return (
      <div style={{ padding: '24px' }}>
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: '#7f1d1d',
            padding: '12px 16px',
            borderRadius: '4px',
          }}
        >
          {errorMessage}
        </div>
        <button
          onClick={() => navigate('/procurement')}
          style={{
            marginTop: '16px',
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Back to PO List
        </button>
      </div>
    );
  }

  if (!poData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        No PO data available
      </div>
    );
  }

  const containerStyle = {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#1f2937',
  };

  const subHeadingStyle = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
  };

  const sectionStyle = {
    marginBottom: '24px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
  };

  const infoItemStyle = {
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '4px',
  };

  const infoLabelStyle = {
    fontSize: '12px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
    fontWeight: '600',
  };

  const infoValueStyle = {
    fontSize: '16px',
    color: '#1f2937',
    fontWeight: '500',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '16px',
  };

  const thStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #d1d5db',
    fontWeight: '600',
    fontSize: '13px',
    color: '#374151',
    backgroundColor: '#f9fafb',
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#1f2937',
  };

  const summaryRowStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '32px',
    padding: '16px 0',
    borderTop: '1px solid #d1d5db',
    marginTop: '16px',
  };

  const summaryItemStyle = {
    textAlign: 'right',
  };

  const summaryLabelStyle = {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '4px',
  };

  const summaryValueStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    flexWrap: 'wrap',
  };

  const primaryButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const dangerButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const secondaryButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const disabledButtonStyle = {
    ...primaryButtonStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  const successMessageStyle = {
    color: '#16a34a',
    fontSize: '14px',
    padding: '12px',
    backgroundColor: '#dcfce7',
    borderRadius: '4px',
    marginBottom: '16px',
  };

  const errorAlertStyle = {
    color: '#7f1d1d',
    fontSize: '14px',
    padding: '12px',
    backgroundColor: '#fee2e2',
    borderRadius: '4px',
    marginBottom: '16px',
  };

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '6px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  };

  const modalHeadingStyle = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1f2937',
  };

  const modalTextStyle = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '20px',
    lineHeight: '1.6',
  };

  const modalButtonGroupStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  };

  const trackingItemStyle = {
    padding: '12px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
  };

  const trackingLabelStyle = {
    fontWeight: '600',
    color: '#374151',
    marginRight: '8px',
  };

  const trackingValueStyle = {
    color: '#6b7280',
  };

  const subtotal =
  poData.line_items?.reduce((sum, item) => {
    return sum + item.quantity * item.rate;
  }, 0) || 0;

  const total = subtotal;

  return (
    <div style={containerStyle}>
    {/* HEADER ROW WITH BACK ARROW */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          background: "white",
          color: "#1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          flexShrink: 0,
        }}
        aria-label="Go back"
      >
        ←
      </button>

      <div>
        <div style={headingStyle}>Purchase Order Details</div>
        <div style={subHeadingStyle}>
          PO Number: {poData.po_number || 'N/A'}
        </div>
      </div>
    </div>

      {successMessage && (
        <div style={successMessageStyle}>{successMessage}</div>
      )}

      {(sendError || error) && (
        <div style={errorAlertStyle}>{sendError || error}</div>
      )}

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Header Information</div>
        <div style={infoGridStyle}>
          <div style={infoItemStyle}>
            <div style={infoLabelStyle}>PO Number</div>
            <div style={infoValueStyle}>{poData.po_number || '-'}</div>
          </div>
          <div style={infoItemStyle}>
            <div style={infoLabelStyle}>Status</div>
            <div style={{ marginTop: '4px' }}>
              <POStatusBadge status={poData.status || 'DRAFT'} />
            </div>
          </div>
          <div style={infoItemStyle}>
            <div style={infoLabelStyle}>PO Date & Time</div>
            <div style={infoValueStyle}>
              {poData.po_sent_at
                ? formatDateTime(poData.po_sent_at)
                : '—'}
            </div>
          </div>
          <div style={infoItemStyle}>
            <div style={infoLabelStyle}>Created Date</div>
            <div style={infoValueStyle}>
              {formatDateTime(poData.created_at)}

            </div>
          </div>
        </div>

        {poData.vendor && <VendorInfoCard vendor={poData.vendor} />}
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Line Items</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Item Code</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Unit</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Rate</th>
                <th style={thStyle}>Line Total</th>
              </tr>
            </thead>
            <tbody>
              {poData.line_items && poData.line_items.length > 0 ? (
                poData.line_items.map((item, index) => {
                  const lineTotal = Number(item.quantity || 0) * Number(item.rate || 0);
                  return (
                    <tr key={index}>
                      <td style={tdStyle}>{item.item_id || '-'}</td>
                      <td style={tdStyle}>{item.item_description || '-'}</td>
                      <td style={tdStyle}>{item.unit || '-'}</td>
                      <td style={tdStyle}>{item.quantity || '0'}</td>
                      <td style={tdStyle}>₹ {Number(item.rate || 0).toFixed(2)}</td>
                      <td style={tdStyle}>₹ {lineTotal.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ ...tdStyle, textAlign: 'center' }}>
                    No line items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={summaryRowStyle}>
          <div style={summaryItemStyle}>
            <div style={summaryLabelStyle}>Subtotal</div>
            <div style={summaryValueStyle}>₹ {subtotal.toFixed(2)}</div>
          </div>
          <div style={summaryItemStyle}>
            <div style={summaryLabelStyle}>Tax</div>
            <div style={summaryValueStyle}>₹ 0.00</div>
          </div>
          <div style={summaryItemStyle}>
            <div style={summaryLabelStyle}>Grand Total</div>
            <div style={{ ...summaryValueStyle, fontSize: '18px' }}>
              ₹ {total.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {tracking && (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Tracking Information</div>
          {tracking ? (
  <>
    <div style={trackingItemStyle}>
      <span style={trackingLabelStyle}>Material Receipt:</span>
      <span style={trackingValueStyle}>
        {tracking.material_receipt_status || 'Not Received'}
      </span>
    </div>

    <div style={trackingItemStyle}>
      <span style={trackingLabelStyle}>QC Accepted:</span>
      <span style={trackingValueStyle}>
        {tracking.qc_accepted_quantity ?? 0}
      </span>
    </div>

    <div style={trackingItemStyle}>
      <span style={trackingLabelStyle}>QC Rejected:</span>
      <span style={trackingValueStyle}>
        {tracking.qc_rejected_quantity ?? 0}
      </span>
    </div>
  </>
) : (
  <div style={trackingItemStyle}>No tracking information available</div>
)}
        </div>
      )}

      <div style={buttonGroupStyle}>
        {poData.status === 'DRAFT' && (
            <>
              <button onClick={handleEditPO} style={primaryButtonStyle}>
                Edit
              </button>
              <button onClick={() => setShowSendConfirm(true)} style={dangerButtonStyle}>
                Send PO
              </button>
              <button onClick={handleCancelPO} style={secondaryButtonStyle}>
                Cancel PO
              </button>
            </>
          )}

          {poData.status === 'SENT' && (
            <button onClick={handleCancelPO} style={secondaryButtonStyle}>
              Cancel PO
            </button>
          )}


        <button
          onClick={() => navigate('/procurement')}
          style={secondaryButtonStyle}
        >
          Back to List
        </button>
      </div>

      {showSendConfirm && (
        <div style={modalStyle} onClick={() => setShowSendConfirm(false)}>
          <div
            style={modalContentStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={modalHeadingStyle}>Send Purchase Order</div>
            <div style={modalTextStyle}>
              Are you sure you want to send this PO? Once sent, you will not be able to edit it.
            </div>
            <div style={modalButtonGroupStyle}>
              <button
                onClick={() => setShowSendConfirm(false)}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>
              <button
                onClick={handleSendPO}
                disabled={sendingPO}
                style={sendingPO ? disabledButtonStyle : dangerButtonStyle}
              >
                {sendingPO ? 'Sending...' : 'Confirm Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PODetails;
