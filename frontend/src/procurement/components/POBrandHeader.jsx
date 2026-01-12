import logo from "../../assets/logo.png";
const POBrandHeader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #e5e7eb",
        paddingBottom: 16,
        marginBottom: 24,
      }}
    >
      {/* LEFT: LOGO + COMPANY */}
      <div style={{ display: "flex", gap: 16 }}>
        <img
          src={logo}
          alt="Company Logo"
          style={{ height: 48, objectFit: "contain" }}
        />

        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            SMG Electric Scooters Pvt Ltd
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.4 }}>
            Plot 45, Industrial Area Phase 2<br />
            Hoshiarpur, Punjab – 146001
          </div>
        </div>
      </div>

      {/* RIGHT: GST */}
      <div style={{ textAlign: "right", fontSize: 13 }}>
        <div style={{ fontWeight: 600 }}>GSTIN</div>
        <div style={{ color: "#374151" }}>03AABCS1234K1Z8</div>
      </div>
    </div>
  );
};

export default POBrandHeader;
