import api from "./axios";

/* Stores Management */

export const getPendingGatePasses = (storeId) =>
  api.get(`/api/v1/store/stores/${storeId}/pending-gate-passes`);

export const receiveGatePass = (gatePassId) =>
  api.post(`/api/v1/store/receive-gate-pass/${gatePassId}`);

export const getGatePassDetails = (gatePassId) =>
  api.get(`/api/v1/store/gate-passes/${gatePassId}`);

export const createStore = (data) =>
  api.post("/api/v1/store/stores", data);

export const getAllStores = (params = {}) =>
  api.get("/api/v1/store/stores", { params });

export const getStoreDetails = (storeId) =>
  api.get(`/api/v1/store/stores/${storeId}`);

export const updateStore = (storeId, data) =>
  api.put(`/api/v1/store/stores/${storeId}`, data);

export const deleteStore = (storeId) =>
  api.delete(`/api/v1/store/stores/${storeId}`);

export const addBin = (storeId, data) =>
  api.post(`/api/v1/store/stores/${storeId}/bins`, data);

export const getStoreBins = (storeId) =>
  api.get(`/api/v1/store/stores/${storeId}/bins`);

export const getPOPendings = (poId) =>
  api.get(`/api/v1/store/po/${poId}/pending-items`);


/* Inventory */

export const addInventory = (data) =>
  api.post("/api/v1/store/inventory", data);

export const getInventory = (params = {}) =>
  api.get("/api/v1/store/inventory", { params });

export const getInventoryItem = (id) =>
  api.get(`/api/v1/store/inventory/${id}`);

/* Dispatch */

export const getDispatches = (params = {}) =>
  api.get("/api/v1/store/material-dispatch", { params });

export const getInventoryItemDetails = (id) =>
  api.get(`/api/v1/store/inventory/${id}`);

export const getInventoryByStore = (storeId) =>
  api.get("/api/v1/store/inventory", {
    params: { store_id: storeId }
  });

/* ================= DISPATCH ================= */

// Create dispatch (always creates DRAFT)
export const createDispatch = (data) =>
  api.post("/api/v1/store/material-dispatch", data);

// Update draft dispatch
export const updateDispatch = (dispatchId, data) =>
  api.put(`/api/v1/store/material-dispatch/${dispatchId}`, data);

// Get single dispatch
export const getDispatchById = (dispatchId) =>
  api.get(`/api/v1/store/material-dispatch/${dispatchId}`);

// Issue draft dispatch
export const issueDispatch = (dispatchId) =>
  api.post(`/api/v1/store/material-dispatch/${dispatchId}/issue`);

// Cancel dispatched dispatch
export const cancelDispatch = (dispatchId, payload) =>
  api.post(
    `/api/v1/store/material-dispatch/${dispatchId}/cancel`,
    payload
  );
