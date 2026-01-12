import { useState, useCallback } from 'react';
import {
  createPO,
  getPOs,
  getPODetails,
  updatePO,
  sendPO,
  cancelPO,
  getPOTracking,
  getPOsByVendor,
  getVendorDetails,
} from '../../api/procurement.api';

export const useProcurement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendorCache, setVendorCache] = useState({});

  const createProcurementOrder = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createPO(data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create PO';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelProcurementOrder = useCallback(async (id) => {
  setLoading(true);
  setError(null);
  try {
    const response = await cancelPO(id);
    return response.data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.detail || err.message || 'Failed to cancel PO';
    setError(errorMessage);
    throw err;
  } finally {
    setLoading(false);
  }
}, []);


  const fetchProcurementOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPOs();
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch POs';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPODetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPODetails(id);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch PO details';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProcurementOrder = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updatePO(id, data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update PO';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendProcurementOrder = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sendPO(id);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send PO';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPOTracking = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPOTracking(id);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch tracking data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPOsByVendor = useCallback(async (vendorId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPOsByVendor(vendorId);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch vendor POs';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVendorDetails = useCallback(
  async (vendorId) => {
    if (!vendorId) return null;

    // ✅ 1. Return from cache if exists
    if (vendorCache[vendorId]) {
      return vendorCache[vendorId];
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getVendorDetails(vendorId);
      const vendor = response.data;

      // ✅ 2. Save to cache
      setVendorCache((prev) => ({
        ...prev,
        [vendorId]: vendor,
      }));

      return vendor;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch vendor details';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  },
  [vendorCache]
);


  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    createProcurementOrder,
    fetchProcurementOrders,
    fetchPODetails,
    updateProcurementOrder,
    sendProcurementOrder,
    cancelProcurementOrder,
    fetchPOTracking,
    fetchPOsByVendor,
    fetchVendorDetails,
    clearError,
  };
};
