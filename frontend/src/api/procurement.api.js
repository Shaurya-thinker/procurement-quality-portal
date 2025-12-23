import api from "./axios";

export const createPO = (data) =>
  api.post("/api/v1/procurement", data);

export const getPOs = () =>
  api.get("/api/v1/procurement");

export const getPODetails = (id) =>
  api.get(`/api/v1/procurement/${id}`);

export const updatePO = (id, data) =>
  api.put(`/api/v1/procurement/${id}`, data);

export const sendPO = (id) =>
  api.post(`/api/v1/procurement/${id}/send`);

export const getPOTracking = (id) =>
  api.get(`/api/v1/procurement/${id}/tracking`);

export const getPOsByVendor = (vendorId) =>
  api.get(`/api/v1/procurement/vendor/${vendorId}`);

export const getVendorDetails = (vendorId) =>
  api.get(`/api/v1/procurement/vendors/${vendorId}`);

export const getItems = () =>
  api.get("/api/v1/procurement/items");

export const cancelPO = (id) =>
  api.post(`/api/v1/procurement/${id}/cancel`);
