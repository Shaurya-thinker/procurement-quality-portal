import { useState, useCallback } from 'react';
import {
  addInventory,
  getInventory,
  getInventoryItemDetails,
  dispatchItem,
  getDispatches,
  createStore,
  getAllStores,
  getStoreDetails,
  updateStore,
  deleteStore,
  addBin,
  getStoreBins,
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
    console.log('[STORE HOOK] Starting dispatch with data:', data);
    
    try {
      // Add 10 second timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - dispatch took too long')), 10000)
      );
      
      const dispatchPromise = dispatchItem(data);
      const response = await Promise.race([dispatchPromise, timeoutPromise]);
      
      console.log('[STORE HOOK] Dispatch successful:', response.data);
      return response.data;
    } catch (err) {
      console.error('[STORE HOOK] Dispatch failed:', err);
      
      let errorMessage = 'Failed to dispatch material';
      
      if (err.message === 'Request timeout - dispatch took too long') {
        errorMessage = 'Dispatch request timed out. Please try again.';
      } else if (err.response?.data?.detail) {
        // FastAPI validation error format
        if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(e => e.msg).join(', ');
        } else {
          errorMessage = err.response.data.detail;
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
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

  const getInventoryItemDetailsAsync = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInventoryItemDetails(id);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch inventory item details';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createStoreAsync = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createStore(data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create store';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllStoresAsync = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllStores(params);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch stores';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStoreDetailsAsync = useCallback(async (storeId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStoreDetails(storeId);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch store details';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStoreAsync = useCallback(async (storeId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateStore(storeId, data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update store';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStoreAsync = useCallback(async (storeId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await deleteStore(storeId);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete store';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addBinAsync = useCallback(async (storeId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await addBin(storeId, data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add bin';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStoreBinsAsync = useCallback(async (storeId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getStoreBins(storeId);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch store bins';
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
    getInventoryItemDetails: getInventoryItemDetailsAsync,
    addInventory: addInventoryAsync,
    dispatchMaterial: dispatchMaterialAsync,
    getDispatches: getDispatchesAsync,
    createStore: createStoreAsync,
    getAllStores: getAllStoresAsync,
    getStoreDetails: getStoreDetailsAsync,
    updateStore: updateStoreAsync,
    deleteStore: deleteStoreAsync,
    addBin: addBinAsync,
    getStoreBins: getStoreBinsAsync,
    clearError,
  };
};
