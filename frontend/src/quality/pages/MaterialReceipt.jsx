import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuality } from '../hooks/useQuality';
import MRHeader from '../components/MRHeader';
import MRLineItemTable from '../components/MRLineItemTable';
import { getPOs } from '../../api/procurement.api';
import { getVendors } from '../../api/vendor.api';
import { getPODetails } from "../../api/procurement.api";
import { getPendingPOItems } from "../../api/procurement.api";


const formatDateForAPI = (date) => {
  if (!date) return null;

  // already yyyy-mm-dd
  if (date.includes("-") && date.split("-")[0].length === 4) {
    return date;
  }

  // convert dd-mm-yyyy → yyyy-mm-dd
  const [dd, mm, yyyy] = date.split("-");
  return `${yyyy}-${mm}-${dd}`;
};


export default function MaterialReceipt() {
  const navigate = useNavigate();
  const {
  createMaterialReceipt,
  loading,
  error,
  clearError,
} = useQuality();

  const [mrData, setMrData] = useState({
  bill_no: '',
  entry_no: '',
  mr_reference_no: '',
  receipt_date: '',
  vehicle_no: '',
  challan_no: '',
  store_id: '',
  bin_id: '',
  remarks: '',
  vendor_id: '',     
  vendor_name: '',
  component_details: '', 
});


  const [lineItems, setLineItems] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    getVendors().then(res => setVendors(res.data));
  }, []);



  /*
Each item:
{
  po_line_id,
  item_code,        // readonly
  description,      // readonly
  unit,             // readonly
  ordered_quantity, // readonly
  received_quantity // editable
}
*/
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedPO, setSelectedPO] = useState(null);

  useEffect(() => {
  getPOs().then(res => {
    const usablePOs = res.data.filter(
      po => po.status !== "CANCELLED"
    );
    setPurchaseOrders(usablePOs);
  });
}, []);



  const containerStyle = {
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  };

  const headingStyle = {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#1e293b',
    lineHeight: '1.2',
    letterSpacing: '-0.5px',
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '32px',
    fontWeight: '500',
  };

  const lineItemsSectionStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f1f5f9',
  };

  const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #f1f5f9',
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0',
  };

  const addItemButtonStyle = {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const footerStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #f1f5f9',
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-end',
  };

  const buttonStyle = {
    padding: '12px 32px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
  };

  const cancelButtonStyle = {
    padding: '12px 32px',
    background: 'white',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  };

  const errorAlertStyle = {
    background: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)',
    color: '#dc2626',
    padding: '16px 20px',
    borderRadius: '12px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid #f87171',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
  };

  const closeErrorStyle = {
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '4px',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  };

 const handlePOSelect = async (poId) => {
  try {
    // 1️⃣ Get PO header (ONLY for vendor info)
   const poRes = await getPODetails(poId);
   const po = poRes.data;
    setSelectedPO(po);

    const vendor = vendors.find(v => v.id === po.vendor_id);
    setMrData(prev => ({
      ...prev,
      vendor_id: po.vendor_id,
      vendor_name: vendor?.name || "",
    }));

    // 2️⃣ Get PENDING ITEMS (SOURCE OF TRUTH)
    const pendingRes = await getPendingPOItems(poId);

    const mappedItems = pendingRes.data
      .filter(item => item.remaining_quantity > 0)
      .map(item => ({
        po_line_id: item.po_line_id,
        item_code: item.item_code,
        description: item.item_description,
        unit: item.unit,
        ordered_quantity: item.ordered_quantity,
        remaining_quantity: item.remaining_quantity,
        received_quantity: "",
      }));

    setLineItems(mappedItems);
  } catch (err) {
    console.error("Failed to load PO pending items", err);
  }
};



useEffect(() => {
  console.log("MR DATA:", mrData);
}, [mrData]);


  const handleSaveReceipt = async () => {
  if (!mrData.bill_no || !mrData.entry_no || !mrData.mr_reference_no) {
    alert('Please fill all mandatory header fields');
    return;
  }

  if (!mrData.store_id || !mrData.bin_id) {
  alert('Store ID and Bin ID are required');
  return;
}

  if (!selectedPO) {
  alert('Please select a Purchase Order');
  return;
}


  if (lineItems.length === 0) {
    alert('No line items found');
    return;
  }


  // 🔴 LINE ITEM VALIDATION
  for (let i = 0; i < lineItems.length; i++) {
    const item = lineItems[i];

    const received = Number(item.received_quantity);
    const ordered = Number(item.ordered_quantity);

    if (isNaN(received) || received <= 0) {
      alert(
        `Received quantity must be greater than 0 for item ${item.item_code}`
      );
      return;
    }

   if (received > item.remaining_quantity) {
      alert(
        `Received quantity (${received}) cannot exceed remaining quantity (${item.remaining_quantity})`
      );
      return;
    }
  }

  // ✅ SAFE TO SUBMIT
  try {
    const payload = {
      po_id: Number(selectedPO.id),
      vendor_id: Number(selectedPO.vendor_id),

      vendor_name: mrData.vendor_name,
      component_details: mrData.component_details,

      bill_no: mrData.bill_no,
      entry_no: mrData.entry_no,
      mr_reference_no: mrData.mr_reference_no,

      receipt_date: formatDateForAPI(mrData.receipt_date),
      vehicle_no: mrData.vehicle_no || null,
      challan_no: mrData.challan_no || null,

      store_id: Number(mrData.store_id),
      bin_id: Number(mrData.bin_id),

      remarks: mrData.remarks || null,

     lines: lineItems
      .filter(item => Number(item.received_quantity) > 0)
      .map(item => ({
        po_line_id: Number(item.po_line_id),
        received_quantity: Number(item.received_quantity),
      })),
    };


    const result = await createMaterialReceipt(payload);

    navigate(`/quality/inspection/${result.id}`, {
      state: { mrData: result },
    });

  } catch (err) {
    console.error(err);
  }
};

  return (
  <div style={containerStyle}>
    <div>
      <h1 style={headingStyle}>Material Receipt</h1>
      <p style={subtitleStyle}>
        Record incoming materials and prepare for quality inspection
      </p>
    </div>

    {error && (
      <div style={errorAlertStyle}>
        <span>{error}</span>
        <span style={closeErrorStyle} onClick={clearError}>
          ✕
        </span>
      </div>
    )}

    <MRHeader
      mrData={mrData}
      onChange={setMrData}
      isReadOnly={false}
    />

    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        border: "1px solid #f1f5f9",
      }}
    >
      <label
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#374151",
          marginBottom: "8px",
          display: "block",
        }}
      >
        Purchase Order
      </label>

      <select
        value={selectedPO?.id || ""}
        onChange={(e) => {
          const poId = Number(e.target.value);
          if (poId) {
            handlePOSelect(poId);
          }
        }}
        style={{
          padding: "12px 16px",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          width: "100%",
        }}
        required
      >
        <option value="">Select Purchase Order</option>
        {purchaseOrders.map((po) => (
          <option key={po.id} value={po.id}>
            {po.po_number}
          </option>
        ))}
      </select>
    </div>

    <div style={lineItemsSectionStyle}>
      <div style={sectionHeaderStyle}>
        <h2 style={sectionTitleStyle}>Line Items</h2>
      </div>
      <MRLineItemTable
        items={lineItems}
        onChange={setLineItems}
        mode="create"
      />
    </div>

    <div style={footerStyle}>
      <div style={actionButtonsStyle}>
        <button
          onClick={() => navigate("/procurement")}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveReceipt}
          className="btn-primary"
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Saving..." : "Save & Proceed to Inspection"}
        </button>
      </div>
    </div>
  </div>
);
}
