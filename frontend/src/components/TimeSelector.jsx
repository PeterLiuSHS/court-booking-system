function TimeSelector({ timeSlots, selectedTime, onTimeSelect }) {
  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: "16px",
        }}
      >
        Select a Time
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          justifyContent: "center",
        }}
      >
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            style={{
              backgroundColor: selectedTime === time ? "#2563eb" : "#e5e7eb",
              color: selectedTime === time ? "white" : "#111827",
              border: "none",
              borderRadius: "10px",
              padding: "10px 16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {time}
          </button>
        ))}
      </div>

      <p
      style={{
        marginTop: "18px",
        marginBottom: 0,
        color: "#cbd5e1",
        textAlign: "center"
      }}
      >
        Selected time: {selectedTime || "Not selected"}
      </p>
    </div>
  );
}

export default TimeSelector;
