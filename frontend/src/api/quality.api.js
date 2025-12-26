import api from "./axios";

/* Material Receipt */

export const createMaterialReceipt = (data) =>
  api.post("/api/v1/quality/material-receipt", data);

export const getMaterialReceipts = () =>
  api.get("/api/v1/quality/material-receipt");

export const getMaterialReceiptDetails = (id) =>
  api.get(`/api/v1/quality/material-receipt/${id}`);

/* Quality Inspection */

export const inspectMaterial = (data) =>
  api.post("/api/v1/quality/inspection", data);

export const getInspectionReport = (inspectionId) =>
  api.get(`/api/v1/quality/inspection/${inspectionId}`);

/* Quality Checklist */

export const createQualityChecklist = (data) =>
  api.post("/api/v1/quality/checklist", data);

/* Quality Sheet */

export const createQualitySheet = (data) =>
  api.post("/api/v1/quality/quality-sheet", data);
