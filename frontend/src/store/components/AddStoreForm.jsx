import { useState } from 'react';
import { useStore } from '../hooks/useStore';
import '../../store/css/Stores.css';

export default function AddStoreForm({ onCreated, onCancel }) {
  const { createStore, loading, error, clearError } = useStore();
  const [form, setForm] = useState({
    store_id: '',
    name: '',
    plant_name: '',
    in_charge_name: '',
    in_charge_mobile: '',
    in_charge_email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError && clearError();
    try {
      await createStore(form);
      onCreated && onCreated();
    } catch (err) {
      // error handled in hook
    }
  };

  return (
    <div className="add-store-form">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Store ID</label>
          <input name="store_id" value={form.store_id} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label>Store Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label>Plant Name</label>
          <input name="plant_name" value={form.plant_name} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label>In-Charge Name</label>
          <input name="in_charge_name" value={form.in_charge_name} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label>In-Charge Mobile</label>
          <input name="in_charge_mobile" value={form.in_charge_mobile} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label>In-Charge Email</label>
          <input type="email" name="in_charge_email" value={form.in_charge_email} onChange={handleChange} required />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>Create Store</button>
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
