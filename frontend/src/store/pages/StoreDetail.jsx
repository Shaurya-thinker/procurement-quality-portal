import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddStoreForm from '../components/AddStoreForm';
import { useStore } from '../hooks/useStore';
import '../css/StoreDetail.css';

export default function StoreDetail() {
  const { storeId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { getStoreDetails, addBin, deleteStore, updateStore, loading, error, clearError } = useStore();
  const [store, setStore] = useState(null);
  const [showAddBinForm, setShowAddBinForm] = useState(false);
  const [binForm, setBinForm] = useState({
    bin_no: '',
    component_details: '',
  });
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadStoreDetails();
  }, [storeId]);

  const loadStoreDetails = async () => {
    try {
      const data = await getStoreDetails(parseInt(storeId));
      setStore(data);
    } catch (err) {
      console.error('Error loading store details:', err);
    }
  };

  const handleAddBin = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (!binForm.bin_no.trim()) {
      setLocalError('Bin number is required');
      return;
    }

    try {
      await addBin(parseInt(storeId), {
        bin_no: binForm.bin_no,
        component_details: binForm.component_details,
      });

      setSuccessMessage('Bin added successfully');
      setBinForm({ bin_no: '', component_details: ''});
      setShowAddBinForm(false);

      setTimeout(() => {
        loadStoreDetails();
        setSuccessMessage('');
      }, 1500);
    } catch (err) {
      setLocalError(err.response?.data?.detail || 'Failed to add bin');
      console.error('Error adding bin:', err);
    }
  };

  const handleDeleteStore = async () => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this store?\nAll bins under this store will also be deleted.'
  );

  if (!confirmDelete) return;

  try {
    await deleteStore(storeId);
    navigate('/store');
  } catch (err) {
    console.error('Error deleting store:', err);
    setLocalError('Failed to delete store');
  }
};

  if (loading && !store) {
    return (
      <div className="store-detail-container">
        <div className="loading-state">
          <p>Loading store details...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="store-detail-container">
        <div className="empty-state">
          <div className="empty-title">Store Not Found</div>
          <button
            onClick={() => navigate('/store')}
            className="back-button"
          >
            ← Back to Stores
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="store-detail-container">
     <div className="detail-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  <button
    onClick={() => navigate(-1)}
    className="back-arrow-btn"
    aria-label="Go back"
  >
    ←
  </button>

  <h1 className="store-detail-title">{store.name}</h1>
</div>


      {(error || localError) && (
        <div className="error-alert">
          <div className="error-content">
            <span className="error-title">Error</span>
            <span className="error-message">
              {error && (error.includes('Network') || error.includes('ECONNREFUSED'))
                ? 'Backend server is not running. Please ensure the backend is started on http://localhost:8000'
                : error || localError}
            </span>
          </div>
          <span
            className="close-button"
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
        <div className="success-alert">
          <span>{successMessage}</span>
          <span
            className="close-button"
            onClick={() => setSuccessMessage('')}
          >
            ✕
          </span>
        </div>
      )}

      <div className="detail-content">
  {isEditing ? (
    <AddStoreForm
      initialData={store}
      isEdit
      onCancel={() => setIsEditing(false)}
      onSubmit={async (formData) => {
        try {
          const updated = await updateStore(store.id, formData);
          setStore(updated);        // ✅ update local state
          setIsEditing(false);      // exit edit mode
        } catch (err) {
          console.error("Failed to update store", err);
        }
      }}
    />
  ) : (
    <div className="store-info-section">
      <h2 className="section-title">Store Information</h2>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Store ID:</span>
          <span className="info-value">{store.store_id}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Plant Name:</span>
          <span className="info-value">{store.plant_name}</span>
        </div>
        <div className="info-item">
          <span className="info-label">In-Charge Name:</span>
          <span className="info-value">{store.in_charge_name}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Mobile:</span>
          <span className="info-value">{store.in_charge_mobile}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Email:</span>
          <span className="info-value">{store.in_charge_email}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Total Bins:</span>
          <span className="info-value bins-count">
            {store.bins?.length || 0}
          </span>
        </div>
      </div>
    </div>
  )}

        <div className="bins-section">
          <div className="bins-header">
            <h2 className="section-title">Bins</h2>
            <button
              onClick={() => setShowAddBinForm(!showAddBinForm)}
              className="add-bin-button"
            >
              {showAddBinForm ? '✕ Cancel' : '+ Add Bin'}
            </button>
          </div>

          {showAddBinForm && (
            <form onSubmit={handleAddBin} className="add-bin-form">
              <div className="form-group">
                <label htmlFor="bin_no" className="form-label">
                  Bin Number *
                </label>
                <input
                  id="bin_no"
                  type="text"
                  value={binForm.bin_no}
                  onChange={(e) =>
                    setBinForm({ ...binForm, bin_no: e.target.value })
                  }
                  className="form-input"
                  placeholder="e.g., BIN-001"
                />
              </div>

              <div className="form-group">
                <label htmlFor="component_details" className="form-label">
                  Component Details
                </label>
                <input
                  id="component_details"
                  type="text"
                  value={binForm.component_details}
                  onChange={(e) =>
                    setBinForm({
                      ...binForm,
                      component_details: e.target.value,
                    })
                  }
                  className="form-input"
                  placeholder="e.g., Motor Parts, Electronics"
                />
              </div>

              <button type="submit" className="submit-button">
                Add Bin
              </button>
            </form>
          )}

          {store.bins && store.bins.length > 0 ? (
            <div className="bins-table-wrapper">
              <table className="bins-table">
                <thead>
                  <tr>
                    <th>Bin No</th>
                    <th>Component Details</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {store.bins.map(bin => (
                    <tr key={bin.id}>
                      <td className="bin-no">{bin.bin_no}</td>
                      <td className="component-details">
                        {bin.component_details || '-'}
                      </td>
                      <td className="created-date">
                        {new Date(bin.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-bins">
              <p className="empty-message">No bins added yet</p>
            </div>
          )}
        </div>
      </div>

     <div className="detail-actions">
    <button
      onClick={() => navigate(`/store/${store.id}/inventory`)}
      className="action-button inventory-button"
    >
      View Store Inventory
    </button>

    <button
      onClick={() => navigate(`/store/${store.id}/gate-passes`)}
      className="action-button inventory-button"
    >
      Receive Gate Pass
    </button> 

    <button
      onClick={() => setIsEditing(true)}
      className="action-button inventory-button"
    >
      Edit Store
    </button>

    <button
      onClick={handleDeleteStore}
      className="action-button delete-button"
    >
      Delete Store
    </button>
  </div>
</div>
);
}