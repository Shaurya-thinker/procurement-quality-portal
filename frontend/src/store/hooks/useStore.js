import { useState, useCallback } from 'react';
import {
  addInventory,
  getInventory,
  dispatchItem,
  getDispatches,
} from '../../api/store.api';

export const useStore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getInventoryAsync = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInventory(params);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch inventory';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addInventoryAsync = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addInventory(data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add inventory';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const dispatchMaterialAsync = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await dispatchItem(data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to dispatch material';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDispatchesAsync = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDispatches(params);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch dispatches';
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
    getInventory: getInventoryAsync,
    addInventory: addInventoryAsync,
    dispatchMaterial: dispatchMaterialAsync,
    getDispatches: getDispatchesAsync,
    clearError,
  };
};
