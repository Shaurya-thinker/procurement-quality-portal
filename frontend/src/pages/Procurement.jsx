import { useState } from 'react';

export default function Procurement() {
  const [pos, setPOs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vendor_id: '',
    lines: [{ item_id: '', quantity: '', price: '' }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/v1/procurement/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer demo-token'
        },
        body: JSON.stringify({
          vendor_id: parseInt(formData.vendor_id),
          lines: formData.lines.map(line => ({
            item_id: parseInt(line.item_id),
            quantity: parseInt(line.quantity),
            price: parseFloat(line.price)
          }))
        })
      });
      
      if (response.ok) {
        const newPO = await response.json();
        setPOs([...pos, newPO]);
        setShowForm(false);
        setFormData({ vendor_id: '', lines: [{ item_id: '', quantity: '', price: '' }] });
        alert('PO created successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'Failed to create PO'}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Procurement Module</h1>
      
      <button 
        onClick={() => setShowForm(!showForm)}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {showForm ? 'Cancel' : 'Create New PO'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Create Purchase Order</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label>Vendor ID:</label>
            <input
              type="number"
              value={formData.vendor_id}
              onChange={(e) => setFormData({...formData, vendor_id: e.target.value})}
              style={{ marginLeft: '10px', padding: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Item ID:</label>
            <input
              type="number"
              value={formData.lines[0].item_id}
              onChange={(e) => setFormData({
                ...formData, 
                lines: [{...formData.lines[0], item_id: e.target.value}]
              })}
              style={{ marginLeft: '10px', padding: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Quantity:</label>
            <input
              type="number"
              value={formData.lines[0].quantity}
              onChange={(e) => setFormData({
                ...formData, 
                lines: [{...formData.lines[0], quantity: e.target.value}]
              })}
              style={{ marginLeft: '10px', padding: '5px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Price:</label>
            <input
              type="number"
              step="0.01"
              value={formData.lines[0].price}
              onChange={(e) => setFormData({
                ...formData, 
                lines: [{...formData.lines[0], price: e.target.value}]
              })}
              style={{ marginLeft: '10px', padding: '5px' }}
              required
            />
          </div>

          <button type="submit" style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            Save as Draft
          </button>
        </form>
      )}

      <div>
        <h3>Purchase Orders</h3>
        {pos.length === 0 ? (
          <p>No purchase orders created yet.</p>
        ) : (
          pos.map(po => (
            <div key={po.id} style={{ padding: '10px', border: '1px solid #ddd', margin: '10px 0', borderRadius: '4px' }}>
              <p><strong>PO Number:</strong> {po.po_number}</p>
              <p><strong>Vendor ID:</strong> {po.vendor_id}</p>
              <p><strong>Status:</strong> {po.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}