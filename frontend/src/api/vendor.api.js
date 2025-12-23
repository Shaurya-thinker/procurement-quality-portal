import api from "./axios";

/**
 * TEMP: Mock vendor list
 * This will later be replaced by Vendor Portal API
 */
export const getVendors = async () => {
  return Promise.resolve({
    data: [
      { id: 1, name: "ElectroParts India Pvt Ltd", status: "APPROVED" },
      { id: 2, name: "BatteryTech Solutions", status: "APPROVED" },
      { id: 3, name: "AutoBody Works", status: "PENDING" },
    ],
  });
};


/**
 * REAL backend call (already exists)
 * Used to fetch vendor info by ID
 */
export const getVendorById = (vendorId) =>
  api.get(`/api/v1/procurement/vendors/${vendorId}`);
