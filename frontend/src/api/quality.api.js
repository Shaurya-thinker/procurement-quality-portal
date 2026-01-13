import api from "./api";

/* Material Receipt */

export const createMaterialReceipt = (data) =>
  api.post("/api/v1/quality/material-receipt/", data);

export const getMaterialReceipts = () =>
  api.get("/api/v1/quality/material-receipt/");

export const getMaterialReceiptDetails = (id) =>
  api.get(`/api/v1/quality/material-receipt/${id}`);

/* Quality Inspection */

export const inspectMaterial = (data) =>
  api.post("/api/v1/quality/inspection/", data);

export const getInspectionReport = (inspectionId) =>
  api.get(`/api/v1/quality/inspection/${inspectionId}`);

/* Quality Checklist */

export const createQualityChecklist = (data) =>
  api.post("/api/v1/quality/checklist/", data);

/* Quality Sheet */

export const createQualitySheet = (data) =>
  api.post("/api/v1/quality/quality-sheet/", data);

/* Gate Pass */

export const generateGatePass = (data) =>
  api.post("/api/v1/quality/gate-pass/", data);

export const getGatePassById = (id) =>
  api.get(`/api/v1/quality/gate-pass/${id}`);

export const getGatePassByInspection = (inspectionId) =>
  api.get(`/api/v1/quality/gate-pass/by-inspection/${inspectionId}`);

export const dispatchGatePassToStore = (gatePassId) => {
  if (!gatePassId) {
    return Promise.reject(
      new Error("Gate Pass ID missing")
    );
  }

  return api.post(
    `/api/v1/quality/gate-pass/${gatePassId}/dispatch`
  );
};


