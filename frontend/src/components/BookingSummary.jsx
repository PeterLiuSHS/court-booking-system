function BookingSummary({
    selectedDate,
    selectedTime,
    selectedCourt,
    bookingConfirmed,
    onConfirmBooking
}) {
    return (
        <div
        style={{
            backgroundColor: "#1e293b",
            borderRadius: "16px",
            padding: "24px"
        }}
        >
            <h2
            style={{
                marginTop: 0,
                marginBottom: "16px"
            }}
            >
                Booking Summary
            </h2>

            <p>Selected date: {selectedDate || "Not selected"}</p>
            <p>Selected time: {selectedTime || "Not selected"}</p>
            <p>Selected court: {selectedCourt || "Not selected"}</p>

            <button
            onClick={onConfirmBooking}
            disabled={!selectedDate || !selectedTime || !selectedCourt}
            style={{
                marginTop: "12px",
                border: "none",
                borderRadius: "10px",
                padding: "12px 18px",
                backgroundColor:
                selectedDate && selectedTime && selectedCourt ? "#16a34a" : "#9ca3af",
                color: "white",
                fontWeight: "bold",
                cursor:
                selectedDate && selectedTime && selectedCourt ? "pointer" : "not-allowed"
            }}
            >
                Confirm Booking
            </button>

            {bookingConfirmed && (
                <p
                style={{
                    marginTop: "16px",
                    color: "#86efac",
                    fontWeight: "bold"
                }}
                >
                    Booking confirmed for {selectedCourt} on {selectedDate} at {selectedTime}.
                </p>
            )}
        </div>
    );
}

export default BookingSummary;