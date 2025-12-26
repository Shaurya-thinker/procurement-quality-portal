import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuality } from '../hooks/useQuality';
import MRHeader from '../components/MRHeader';
import InspectionSummary from '../components/InspectionSummary';
import { getPODetails } from '../../api/procurement.api';


export default function Inspection() {
  const navigate = useNavigate();
  const { mrNumber } = useParams();
  const location = useLocation();
  const { submitInspection, loading, error, clearError } = useQuality();
  const [poData, setPoData] = useState(null);

  const [mrData, setMrData] = useState(location.state?.mrData || null);
  const [inspectionItems, setInspectionItems] = useState([]);
  const [inspectorName, setInspectorName] = useState('');
  const [validationError, setValidationError] = useState('');

      // Initialize inspection items from material receipt
      useEffect(() => {
        const initInspection = async () => {
          if (!location.state?.mrData) return;

          const mr = location.state.mrData;
          setMrData(mr);

          try {
            const poRes = await getPODetails(mr.po_id);
            const po = poRes.data;

            setPoData(po);

            const items = po.line_items.map(poLine => {
              const mrLine = mr.lines.find(
                l => l.po_line_id === poLine.id
              );

              return {
                mr_line_id: mrLine.id,   // ✅ CRITICAL
                po_line_id: poLine.id,
                item_code: poLine.item_code,
                description: poLine.item_description,
                unit: poLine.unit,
                received_quantity: mrLine?.received_quantity || 0,
                accepted_quantity: '',
                rejected_quantity: '',
              };
            });

            setInspectionItems(items);
          } catch (err) {
            console.error('Failed to load PO for inspection', err);
          }
        };

        initInspection();
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

  for (const item of inspectionItems) {
    const received = Number(item.received_quantity);
    const accepted = Number(item.accepted_quantity || 0);
    const rejected = Number(item.rejected_quantity || 0);

    if (accepted + rejected !== received) {
      setValidationError(
        `Item ${item.item_code}: Accepted + Rejected must equal Received`
      );
      return false;
    }

    if (accepted === 0 && rejected === 0) {
      setValidationError(
        `Item ${item.item_code}: Either accepted or rejected quantity must be entered`
      );
      return false;
    }
  }

  return true;
};


  const handleSubmitInspection = async () => {
  if (!validateInspection()) return;

  try {
    const payload = {
      mr_id: mrData.id,
      inspected_by: inspectorName,
      remarks: "Inspection completed",
      lines: inspectionItems.map(item => ({
        mr_line_id: item.mr_line_id, // YOU MUST ADD THIS (see Bug #3)
        accepted_quantity: Number(item.accepted_quantity),
        rejected_quantity: Number(item.rejected_quantity),
      })),
    };

    const result = await submitInspection(payload);

    navigate(`/quality/gate-pass/${result.id}`, {
      state: {
        mrData,
        inspectionData: result,
        poData,
      },
    });
  } catch (err) {
    console.error(err);
  }
};


  if (!mrData) {
    return <div style={{ padding: 24 }}>No Material Receipt found</div>;
  }

  return (
    <div style={{ padding: 24 }}>

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

      <MRHeader mrData={mrData} isReadOnly />

      <div style={{ margin: '16px 0' }}>
        <label style={{ fontWeight: 600 }}>Inspector Name</label>
        <input
          style={{ display: 'block', marginTop: 6 }}
          value={inspectorName}
          onChange={e => setInspectorName(e.target.value)}
        />
      </div>


      <InspectionSummary
        items={inspectionItems}
        onChange={setInspectionItems}
      />

      <button onClick={handleSubmitInspection} disabled={loading}>
        Submit Inspection
      </button>
    </div>
  );
}