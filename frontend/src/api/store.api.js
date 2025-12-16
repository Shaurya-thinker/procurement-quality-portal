import api from "./axios";

/* Inventory */

export const addInventory = (data) =>
  api.post("/api/v1/store/inventory", data);

export const getInventory = (params = {}) =>
  api.get("/api/v1/store/inventory", { params });

export const getInventoryItem = (id) =>
  api.get(`/api/v1/store/inventory/${id}`);

/* Dispatch */

export const dispatchItem = (data) =>
  api.post("/api/v1/store/dispatch", data);

export const getDispatches = (params = {}) =>
  api.get("/api/v1/store/dispatches", { params });
