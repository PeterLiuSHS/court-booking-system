

function VenuesPage({ venues }) {

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>venues</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        {venues.map((venue) => (
          <div
            key={venue.name}
            style={{
              backgroundColor: "#1e293b",
              borderRadius: "16px",
              padding: "16px",
            }}
          >
            <img
              src={venue.image}
              alt={venue.name}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "14px",
              }}
            />

            <h3 style={{ marginTop: 0 }}>{venue.name}</h3>
            <p>Type: {venue.type}</p>
            <p>Capacity: {venue.capacity} people</p>
            <p>Floor Material: {venue.floor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VenuesPage;
