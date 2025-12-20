import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import AddStoreForm from '../components/AddStoreForm';
import '../css/Stores.css';

export default function Stores() {
  const navigate = useNavigate();
  const { getAllStores, loading, error, clearError } = useStore();
  const [stores, setStores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddStoreForm, setShowAddStoreForm] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const data = await getAllStores();
      setStores(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error('Error loading stores:', err);
    }
  };

  const handleStoreClick = (storeId) => {
    navigate(`/store/${storeId}`);
  };

  const filteredStores = stores.filter(store =>
    store.store_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.plant_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="stores-container">
      <h1 className="stores-title">Store Management</h1>

      {error && (
        <div className="error-alert">
          <div className="error-content">
            <span className="error-title">Network Error</span>
            <span className="error-message">
              {error.includes('Network') || error.includes('ECONNREFUSED')
                ? 'Backend server is not running. Please ensure the backend is started on http://localhost:8000'
                : error}
            </span>
          </div>
          <span
            className="close-button"
            onClick={() => clearError()}
          >
            ✕
          </span>
        </div>
      )}

        <div className="stores-filter">
          <input
            type="text"
            placeholder="Search by Store ID, Name, or Plant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <button
            className="back-button"
            style={{ marginLeft: '16px' }}
            onClick={() => setShowAddStoreForm(true)}
          >
            + Add Store
          </button>
        </div>
      
            {showAddStoreForm && (
        <div style={{ marginBottom: '32px' }}>
          <AddStoreForm
            onCreated={() => {
              setShowAddStoreForm(false);
              loadStores();
            }}
            onCancel={() => setShowAddStoreForm(false)}
          />
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <p>Loading stores...</p>
        </div>
      ) : filteredStores.length > 0 ? (
        <div className="stores-grid">
          {filteredStores.map(store => (
            <div
              key={store.id}
              className="store-card"
              onClick={() => handleStoreClick(store.id)}
            >
              <div className="store-card-header">
                <h3 className="store-name">{store.name}</h3>
                <span className="store-id-badge">{store.store_id}</span>
              </div>

              <div className="store-card-content">
                <div className="info-row">
                  <span className="info-label">Plant:</span>
                  <span className="info-value">{store.plant_name}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">In-Charge:</span>
                  <span className="info-value">{store.in_charge_name}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">Mobile:</span>
                  <span className="info-value">{store.in_charge_mobile}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{store.in_charge_email}</span>
                </div>

                <div className="bins-count">
                  <span className="bins-label">Bins:</span>
                  <span className="bins-value">{store.bins?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-title">No Stores Found</div>
            <p className="empty-description">
              {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding a new store'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
