import { useState, useCallback } from 'react';
import {
  createMaterialReceipt,
  getMaterialReceipts,
  inspectMaterial,
  getInspectionReport,
} from '../../api/quality.api';

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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    createMaterialReceipt: createMaterialReceiptAsync,
    getMaterialReceipts: getMaterialReceiptsAsync,
    inspectMaterial: inspectMaterialAsync,
    getInspectionReport: getInspectionReportAsync,
    clearError,
  };
};
