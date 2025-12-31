import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createContractor } from "../../api/contractors.api";

export default function CreateContractor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await createContractor({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
    });

    navigate("/contractors");
  } catch (error) {
    console.error("Failed to create contractor", error);
    alert("Failed to save contractor. Check backend.");
  }
};


  return (
    <div style={{ padding: "24px", maxWidth: "600px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}>
        Create Contractor
      </h1>

      <form onSubmit={handleSubmit} style={{ background: "white", padding: "24px", borderRadius: "12px" }}>
        
        <div className="form-group">
          <label className="form-label">Contractor Name</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            name="phone"
            className="form-input"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            className="form-input"
            value={formData.address}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button type="button" className="btn-secondary" onClick={() => navigate("/contractors")}>
            Cancel
          </button>

          <button type="submit" className="btn-primary">
            Save Contractor
          </button>
        </div>
      </form>
    </div>
  );
}

