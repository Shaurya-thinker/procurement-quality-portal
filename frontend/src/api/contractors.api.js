import api from "./api";

// Get all contractors
export const fetchContractors = async () => {
  const res = await api.get("/api/v1/contractors/");
  return res.data;
};

// Get single contractor by ID
export const fetchContractorById = async (id) => {
  const res = await api.get(`/api/v1/contractors/${id}`);
  return res.data;
};

// Create contractor
export const createContractor = async (payload) => {
  const res = await api.post("/api/v1/contractors/", payload);
  return res.data;
};

// Update contractor
export const updateContractor = async (id, payload) => {
  const res = await api.put(`/api/v1/contractors/${id}`, payload);
  return res.data;
};

// Delete contractor
export const deleteContractor = async (id) => {
  const res = await api.delete(`/api/v1/contractors/${id}`);
  return res.data;
};

// Deactivate contractor (ACTIVE → INACTIVE)
export const deactivateContractor = async (id) => {
  const res = await api.put(`/api/v1/contractors/${id}`, {
    status: "INACTIVE",
  });
  return res.data;
};

// Activate contractor (INACTIVE → ACTIVE)
export const activateContractor = async (id) => {
  const res = await api.put(`/api/v1/contractors/${id}`, {
    status: "ACTIVE",
  });
  return res.data;
};

// Blacklist contractor (INACTIVE → BLACKLISTED)
export const blacklistContractor = async (id) => {
  const res = await api.put(`/api/v1/contractors/${id}`, {
    status: "BLACKLISTED",
  });
  return res.data;
};
