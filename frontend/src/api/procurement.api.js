import api from "./axios";

export const createPO = (data) =>
  api.post("/api/v1/procurement", data);

export const getPOs = () =>
  api.get("/api/v1/procurement");

export const getPODetails = (id) =>
  api.get(`/api/v1/procurement/${id}`);
