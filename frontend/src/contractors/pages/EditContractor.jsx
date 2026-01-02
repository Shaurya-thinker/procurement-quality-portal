import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchContractorById,
  updateContractor,
} from "../../api/contractors.api";
import ContractorForm from "../components/ContractorForm";

export default function EditContractor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchContractorById(id).then(setFormData);
  }, [id]);

  if (!formData) return <div style={{ padding: 24 }}>Loading...</div>;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateContractor(id, formData);
    navigate(`/contractors/${id}`);
  };

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>
        Edit Contractor
      </h1>

      <ContractorForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/contractors/${id}`)}
        submitLabel="Update Contractor"
      />
    </div>
  );
}
