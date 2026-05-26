function CourtCard({ court, selectedCourt, onCourtSelect }) {
  const isSelected = selectedCourt === court.name;

  return (
    <div
      onClick={() => onCourtSelect(court)}
      style={{
        backgroundColor: isSelected ? "#dbeafe" : "white",
        color: "#111827",
        border: isSelected ? "2px solid #2563eb" : "1px solid #d1d5db",
        borderRadius: "16px",
        padding: "14px",
        cursor: court.available ? "pointer" : "not-allowed",
        opacity: court.available ? 1 : 0.6,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        transition: "0.2s",
      }}
    >
      <img
        src={court.image}
        alt={court.name}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "12px",
          marginBottom: "14px",
        }}
      />
        <h3
          style={{
            marginTop: 0,
            marginBottom: "10px",
          }}
        >
          {court.name}
        </h3>

        <p
          style={{
            margin: "6px 0",
          }}
        >
          Type: {court.type}
        </p>

        <p
        style={{
            margin: "6px 0 14px 0",
            fontWeight: "bold",
            color: court.available ? "#16a34a" : "#dc2626"
        }}
        >
            {court.available ? "Availabe" : "Unavailable"}
        </p>

        <button
        onClick={(e) => {
            e.stopPropagation();
            onCourtSelect(court);
        }}
        disabled={!court.available}
        style={{
            width: "100%",
            border: "none",
            borderRadius: "10px",
            padding: "10px",
            backgroundColor: court.available ? "#2563eb" : "#9ca3af",
            color:"white",
            fontWeight: "bold",
            cursor: court.available ? "pointer" : "not-allowed"
        }}
        >
            {court.available ? "Select Court" : "Unavailable"}
        </button>
    </div>
  );
}

export default CourtCard;
