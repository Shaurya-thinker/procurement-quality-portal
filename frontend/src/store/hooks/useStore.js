import { useState, useCallback } from 'react';
import {
  addInventory,
  getInventory,
  getInventoryItemDetails,
  getDispatches,
  createStore,
  getAllStores,
  getStoreDetails,
  updateStore,
  deleteStore,
  addBin,
  getStoreBins,
  getInventoryByStore,
} from '../../api/store.api';
import { getPendingGatePasses, receiveGatePass, getGatePassDetails } from '../../api/store.api';



export const useStore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPendingGatePassesAsync = useCallback(async (storeId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPendingGatePasses(storeId);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getGatePassDetailsAsync = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await getGatePassDetails(id);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const receiveGatePassAsync = useCallback(async (gatePassId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await receiveGatePass(gatePassId);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);


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


  const getInventoryByStoreAsync = useCallback(async (storeId) => {
  setLoading(true);
  setError(null);
  try {
    const response = await getInventoryByStore(storeId);
    return response.data;
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to fetch inventory';
    setError(msg);
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
    getDispatches: getDispatchesAsync,
    createStore: createStoreAsync,
    getAllStores: getAllStoresAsync,
    getStoreDetails: getStoreDetailsAsync,
    updateStore: updateStoreAsync,
    deleteStore: deleteStoreAsync,
    addBin: addBinAsync,
    getStoreBins: getStoreBinsAsync,
    getInventoryByStore: getInventoryByStoreAsync,
    getPendingGatePasses: getPendingGatePassesAsync,
    receiveGatePass: receiveGatePassAsync,
    getGatePassDetails: getGatePassDetailsAsync,
    clearError,
  };
};
