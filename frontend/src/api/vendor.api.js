import api from "./api";

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
      { id: 4, name: "EnginePro Components", status: "APPROVED" },
      { id: 5, name: "Speedy Motors Supplies", status: "REJECTED" },
      { id: 6, name: "ChassisMaster", status: "APPROVED" },
      { id: 7, name: "GearMaster", status: "PENDING" },
      { id: 8, name: "WheelsWorld", status: "APPROVED" },
      { id: 9, name: "SuspensionPro", status: "APPROVED" },
      { id: 10, name: "ExhaustParts", status: "REJECTED" },
    ],
  });
};


/**
 * REAL backend call (already exists)
 * Used to fetch vendor info by ID
 */
export const getVendorById = (vendorId) =>
  api.get(`/api/v1/procurement/vendors/${vendorId}`);
