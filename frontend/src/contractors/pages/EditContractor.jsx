import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchContractorById, updateContractor } from "../../api/contractors.api";

export default function EditContractor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchContractorById(id).then(setFormData);
  }, [id]);

  if (!formData) return <p>Loading...</p>;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateContractor(id, formData);
    navigate(`/contractors/${id}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
      <h1>Edit Contractor</h1>

      <input name="name" value={formData.name} onChange={handleChange} />
      <input name="phone" value={formData.phone} onChange={handleChange} />
      <input name="email" value={formData.email || ""} onChange={handleChange} />

      <button type="submit">Save</button>
    </form>
  );
}
