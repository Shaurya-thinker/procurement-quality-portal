import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import InventoryTable from '../components/InventoryTable';
import StockSummary from '../components/StockSummary';
import GatePassReceiveCard from '../components/GatePassReceiveCard';

export default function Inventory() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getInventory, addInventory, loading, error, clearError } = useStore();

  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [locations, setLocations] = useState([]);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const gatePassData = location.state?.gatePassData;
  const inspectionData = location.state?.inspectionData;
  const mrData = location.state?.mrData;

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const data = await getInventory();
      const itemsArray = Array.isArray(data) ? data : data.data || [];
      setInventory(itemsArray);
      
      // Extract unique locations
      const uniqueLocations = Array.from(
        new Set(itemsArray.map(item => item.location).filter(Boolean))
      ).sort();
      setLocations(uniqueLocations);
    } catch (err) {
      console.error('Error loading inventory:', err);
    }
  };

  const handleReceiveGatePass = async (itemsToReceive) => {
    setLocalError('');
    setSuccessMessage('');

    try {
      for (const item of itemsToReceive) {
        await addInventory({
          item_code: item.item_code,
          item_name: item.item_name,
          quantity: item.quantity,
          location: item.location,
          gate_pass_number: item.gate_pass_number,
          mr_number: item.mr_number,
        });
      }

      setSuccessMessage(`${itemsToReceive.length} items received successfully`);
      
      // Reload inventory
      setTimeout(() => {
        loadInventory();
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to receive items');
      console.error('Error receiving items:', err);
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

  const filterContainerStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const filterGroupStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'inherit',
  };

  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'inherit',
    cursor: 'pointer',
  };

  const clearButtonStyle = {
    padding: '8px 12px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
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

  const actionsStyle = {
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

  const dispatchButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Inventory</h1>

      {(error || localError) && (
        <div style={errorAlertStyle}>
          <span>{error || localError}</span>
          <span
            style={closeButtonStyle}
            onClick={() => {
              clearError();
              setLocalError('');
            }}
          >
            ✕
          </span>
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

      {gatePassData && (
        <GatePassReceiveCard
          gatePassData={gatePassData}
          onReceive={handleReceiveGatePass}
          loading={loading}
        />
      )}

      {inventory.length > 0 && (
        <>
          <StockSummary items={inventory} />

          <div style={filterContainerStyle}>
            <div style={filterGroupStyle}>
              <label style={labelStyle}>Search</label>
              <input
                type="text"
                placeholder="Item code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={filterGroupStyle}>
              <label style={labelStyle}>Location</label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={selectStyle}
              >
                <option value="">All Locations</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {(searchTerm || locationFilter) && (
              <button onClick={handleClearFilters} style={clearButtonStyle}>
                Clear Filters
              </button>
            )}
          </div>

          <InventoryTable
            items={inventory}
            searchTerm={searchTerm}
            locationFilter={locationFilter}
          />

          <div style={actionsStyle}>
            <button onClick={() => navigate('/store/dispatch')} style={dispatchButtonStyle}>
              + Create Dispatch
            </button>
          </div>
        </>
      )}

      {inventory.length === 0 && !gatePassData && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          padding: '48px 24px',
          textAlign: 'center',
          color: '#6b7280',
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
            No Inventory Items
          </div>
          <p>Start by receiving items from quality inspections or importing from gate passes.</p>
        </div>
      )}
    </div>
  );
}
