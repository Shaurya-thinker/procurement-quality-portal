import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createContractor } from "../../api/contractors.api";
import "../css/contractors.css";

export default function CreateContractor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createContractor(formData);
      navigate("/contractors");
    } catch (err) {
      setError("Failed to create contractor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contractors-page">
      <h1>Add Contractor</h1>

      {error && <p className="error-text">{error}</p>}

      <form className="contractor-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Contractor Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="BLACKLISTED">Blacklisted</option>
        </select>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/contractors")}
          >
            Cancel
          </button>

          <button className="primary-btn" disabled={loading}>
            {loading ? "Saving..." : "Create Contractor"}
          </button>
        </div>
      </form>
    </div>
  );
}
