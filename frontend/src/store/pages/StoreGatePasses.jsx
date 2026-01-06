import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../hooks/useStore";
import GatePassReceiveCard from "../components/GatePassReceiveCard";

export default function StoreGatePasses() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const {
    getPendingGatePasses,
    receiveGatePass,
    getGatePassDetails,
    loading
  } = useStore();


  const [gatePasses, setGatePasses] = useState([]);
  const [selectedGatePass, setSelectedGatePass] = useState(null);

  useEffect(() => {
    loadGatePasses();
  }, [storeId]);

  const loadGatePasses = async () => {
    try {
      const data = await getPendingGatePasses(storeId);
      setGatePasses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load gate passes", err);
    }
  };

  const handleReceive = async () => {
    if (!selectedGatePass) return;

    try {
      await receiveGatePass(selectedGatePass.id);
      alert("Gate Pass received successfully");
      setSelectedGatePass(null);
      loadGatePasses();
    } catch (err) {
      alert("Failed to receive gate pass");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
       <button
            onClick={() => navigate(-1)}
            className="back-arrow-btn"
            aria-label="Go back"
        >
            ←
        </button>

      <h2 style={{ marginBottom: "20px" }}>
        Pending Gate Passes (Store ID: {storeId})
      </h2>

      {gatePasses.length === 0 && (
        <p>No pending gate passes for this store.</p>
      )}

      {!selectedGatePass && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "24px",
          }}
        >
          <thead>
            <tr>
              <th style={th}>Gate Pass No</th>
              <th style={th}>MR No</th>
              <th style={th}>Vendor</th>
              <th style={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {gatePasses.map((gp) => (
              <tr key={gp.id}>
                <td style={td}>{gp.gate_pass_number}</td>
                <td style={td}>{gp.mr_number}</td>
                <td style={td}>{gp.vendor_name}</td>
                <td style={td}>
                <button onClick={async () => {
                    const full = await getGatePassDetails(gp.id);
                    setSelectedGatePass(full);
                    }}
                    className="btn-primary"
                >
                Receive
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedGatePass && (
        <GatePassReceiveCard
          gatePassData={selectedGatePass}
          onReceive={handleReceive}
          loading={loading}
        />
      )}
    </div>
  );
}

const th = {
  borderBottom: "2px solid #e5e7eb",
  padding: "8px",
  textAlign: "left",
};

const td = {
  borderBottom: "1px solid #e5e7eb",
  padding: "8px",
};
