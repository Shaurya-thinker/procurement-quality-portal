import { getVendors } from '../../api/vendor.api';
import { useEffect, useState } from 'react';
import { getAllStores, getStoreBins } from '../../api/store.api';


export default function MRHeader({ mrData, onChange, isReadOnly = false }) {
  const containerStyle = {
    background: 'white',
    borderRadius: '16px',
    border: '1px solid #f1f5f9',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f1f5f9',
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    lineHeight: '1.4',
  };

  const handleChange = (field, value) => {
    if (!isReadOnly && onChange) {
      onChange({ ...mrData, [field]: value });
    }
  };

  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    getVendors().then(res => setVendors(res.data));
  },  []);

  const [stores, setStores] = useState([]);
  const [bins, setBins] = useState([]);

  useEffect(() => {
    getAllStores().then(res => setStores(res.data));
  }, []);

  useEffect(() => {
    if (!mrData.store_id) {
      setBins([]);
      return;
    }

    getStoreBins(mrData.store_id).then(res => setBins(res.data));
  }, [mrData.store_id]);


  
  const inputStyle = {
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: isReadOnly ? '#f8fafc' : 'white',
    color: '#1e293b',
    cursor: isReadOnly ? 'not-allowed' : 'text',
    transition: 'all 0.3s ease',
    fontWeight: '500',
  };


  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={{ fontSize: '24px' }}>📋</span>
        <h2 style={titleStyle}>Material Receipt Details</h2>
      </div>
      <div style={gridStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Bill No</label>
          <input
            type="text"
            value={mrData.bill_no || ''}
            onChange={(e) => handleChange('bill_no', e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
            required
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={mrData.receipt_date || ''}
            onChange={(e) => handleChange('receipt_date', e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
            required
          />
        </div>

        <div style={fieldStyle}>
  <label style={labelStyle}>Vendor</label>

  {isReadOnly ? (
    <input
      type="text"
      value={
        mrData.vendor_name ||
        vendors.find(v => v.id === mrData.vendor_id)?.name ||
        '—'
      }
      readOnly
      style={{
        ...inputStyle,
        backgroundColor: '#f8fafc',
        cursor: 'not-allowed',
      }}
    />
  ) : (
    <select
      value={mrData.vendor_id ?? ''}
      onChange={(e) => {
              const vendorId = Number(e.target.value);
              const vendor = vendors.find(v => v.id === vendorId);

              onChange({
                ...mrData,
                vendor_id: vendorId,
                vendor_name: vendor?.name || '',
              });
            }}
            style={{
              ...inputStyle,
              cursor: 'pointer',
            }}
            required
          >
            <option value="">Select Vendor</option>
            {vendors
              .filter(v => v.status === 'APPROVED')
              .map(v => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
          </select>
        )}
      </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Component Details</label>
          <input
            type="text"
            value={mrData.component_details || 'Auto-filled from bin'}
            disabled
            style={{ ...inputStyle, backgroundColor: '#f8fafc' }}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Vehicle No</label>
          <input
            type="text"
            value={mrData.vehicle_no || ''}
            onChange={(e) => handleChange('vehicle_no', e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Entry No</label>
          <input
            type="text"
            value={mrData.entry_no || ''}
            onChange={(e) => handleChange('entry_no', e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
            required
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Store</label>
          <select
            value={mrData.store_id || ''}
            onChange={(e) => {
              const storeId = Number(e.target.value);
              onChange({
                ...mrData,
                store_id: storeId,
                bin_id: '', // reset bin on store change
              });
            }}
            disabled={isReadOnly}
            style={{ ...inputStyle, cursor: 'pointer' }}
            required
          >
            <option value="">Select Store</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.name} ({store.plant_name})
              </option>
            ))}
          </select>

          <label style={{ ...labelStyle, marginTop: 8 }}>Bin</label>
          <select
            value={mrData.bin_id || ''}
            onChange={(e) => {
              const binId = Number(e.target.value);
              const selectedBin = bins.find(b => b.id === binId);

              onChange({
                ...mrData,
                bin_id: binId,
                component_details: selectedBin?.component_details || '',
              });
            }}
            disabled={isReadOnly || !mrData.store_id}
            style={{
              ...inputStyle,
              cursor: mrData.store_id ? 'pointer' : 'not-allowed',
            }}
            required
          >
            <option value="">
              {mrData.store_id ? 'Select Bin' : 'Select Store First'}
            </option>
            {bins.map(bin => (
              <option key={bin.id} value={bin.id}>
                {bin.bin_no} — {bin.component_details || 'General'}
              </option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>MR Reference No</label>
          <input
            type="text"
            value={mrData.mr_reference_no || ''}
            onChange={(e) => handleChange('mr_reference_no', e.target.value)}
            disabled={isReadOnly}
            style={inputStyle}
            required
          />
        </div>
      </div>
    </div>
  );
}
