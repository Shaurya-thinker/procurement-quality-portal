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

          <button
            className="back-button"
            style={{ marginLeft: '8px', backgroundColor: '#10b981' }}
            onClick={() => navigate('/store/dispatches')}
          >
            📦 Material Dispatches
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
        <div className="stores-table-wrapper">
          <table className="stores-table">
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Store ID</th>
                <th>Plant</th>
                <th>In-Charge</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Bins</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStores.map(store => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.store_id}</td>
                  <td>{store.plant_name}</td>
                  <td>{store.in_charge_name}</td>
                  <td>{store.in_charge_mobile}</td>
                  <td>{store.in_charge_email}</td>
                  <td>{store.bins?.length || 0}</td>

                  <td className="actions-cell">
                  <button
                    className="table-btn view"
                    onClick={() => handleStoreClick(store.id)}
                  >
                    View
                  </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>
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
