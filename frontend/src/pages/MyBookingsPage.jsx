function MyBookingsPage({ bookings, setBookings, currentUser }) {

  const userBookings = bookings.filter(
    (booking) => booking.userId === currentUser?._id
  );
  
  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if(!response.ok){
        alert(data.message || "Failed to cancel booking.");
        return;
      }

      const updatedBookings = bookings.filter(
        (booking) => booking._id !== bookingId
      );

      setBookings(updatedBookings);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Unable to connect to the backend server.")
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>My Bookings</h1>

      {userBookings.length === 0 ? (
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "16px",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginTop: 0 }}>No bookings yet</h2>
          <p style={{ color: "#cdb5e1" }}>
            You have not reserved any court yet. Go to the Reserve page to make
            a booking.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {userBookings.map((item) => (
            <div
              key={item._id}
              style={{
                backgroundColor: "#1e293b",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>{item.court}</h3>
              <p>Date: {item.date}</p>
              <p>Time: {item.time}</p>
              <p>Court: {item.court}</p>
              <p>Status: {item.status || "Confirmed"}</p>

              <button
                onClick={() => handleCancelBooking(item._id)}
                style={{
                  marginTop: "12px",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookingsPage;
