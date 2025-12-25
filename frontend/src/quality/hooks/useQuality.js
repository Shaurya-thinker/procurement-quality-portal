import { useState, useCallback } from 'react';
import {
  createMaterialReceipt,
  getMaterialReceipts,
  getMaterialReceiptDetails,
  inspectMaterial,
  getInspectionReport,
  createQualityChecklist,
  createQualitySheet,
} from '../../api/quality.api';
import { getPOs } from '../../api/procurement.api';


export const useQuality = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createMaterialReceiptAsync = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createMaterialReceipt(data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create material receipt';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMaterialReceiptsAsync = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMaterialReceipts();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch material receipts';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPurchaseOrdersAsync = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await getPOs();
    return response.data;
  } catch (err) {
    setError("Failed to load purchase orders");
    throw err;
  } finally {
    setLoading(false);
  }
}, []);

  const inspectMaterialAsync = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await inspectMaterial(data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit inspection';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInspectionReportAsync = useCallback(async (inspectionId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInspectionReport(inspectionId);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch inspection report';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMaterialReceiptDetailsAsync = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMaterialReceiptDetails(id);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch material receipt details';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createQualityChecklistAsync = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createQualityChecklist(data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create quality checklist';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createQualitySheetAsync = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createQualitySheet(data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create quality sheet';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    createMaterialReceipt: createMaterialReceiptAsync,
    getPurchaseOrders: getPurchaseOrdersAsync,
    getMaterialReceipts: getMaterialReceiptsAsync,
    getMaterialReceiptDetails: getMaterialReceiptDetailsAsync,
    inspectMaterial: inspectMaterialAsync,
    getInspectionReport: getInspectionReportAsync,
    createQualityChecklist: createQualityChecklistAsync,
    createQualitySheet: createQualitySheetAsync,
    clearError,
  };
};
