import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TimeSelector from "../components/TimeSelector";
import CourtCard from "../components/CourtCard";
import BookingSummary from "../components/BookingSummary";


function ReservePage({ bookings, setBookings, currentUser, venues }) {
  const navigate = useNavigate();

  const timeSlots = [
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
  ];

  const savedBooking = JSON.parse(                    // JSON.parse() is to convert String to an JS object
    localStorage.getItem("pendingBooking") || "{}"    // pendingBooking is the name of key
  );

  const [selectedTime, setSelectedTime] = useState(savedBooking.time || "");
  const [selectedCourt, setSelectedCourt] = useState(savedBooking.court || "");
  const [selectedDate, setSelectedDate] = useState(savedBooking.date || "");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setSelectedCourt("");
    setBookingConfirmed(false);
  };

  const handleCourtSelect = (court) => {
    if (!court.available) return;
    setSelectedCourt(court.name);
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedCourt) return;

    if (!currentUser){
      const pendingBooking = {
        date: selectedDate,
        time: selectedTime,
        court: selectedCourt,
      };

      localStorage.setItem("pendingBooking", JSON.stringify(pendingBooking));

      alert("Please log in beofore confirming your booking.");
      navigate("/login");
      return;
    }

    const newBooking = {
      date: selectedDate,
      time: selectedTime,
      court: selectedCourt,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",    // create action
        headers: {
          "Content-Type": "application/json",  // tell backend the type of data
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBooking),    // data send to backend
      });

      const data = await response.json();

      if (!response.ok){
        alert(data.message || "Failed to create booking.");
        return;
      }

      setBookings([...bookings, data]);  // extend bookings, and add data to bookings, and generate a new object
      setBookingConfirmed(true);
      navigate("/my-bookings");
    } catch (error){
      console.error("Error creating booking:", error);
      alert("Unable to connect to the backend server.");
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() +1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Book a Venue
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            marginBottom: "30px",
          }}
        >
          Choose a time slot and then select an available court.
        </p>

        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Select a Date</h2>

          <input
            type="date"
            min={getTomorrowDate()}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime("");
              setSelectedCourt("");
              setBookingConfirmed(false);
            }}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              fontSize: "16px",
            }}
          />

          <p style={{ color: "#cbd5e1", marginBottom: 0, marginTop: "16px" }}>
            Selected date: {selectedDate || "Not selected"}
          </p>
        </div>

        {selectedDate && (
          <TimeSelector
            timeSlots={timeSlots}
            selectedTime={selectedTime}
            onTimeSelect={handleTimeSelect}
          />
        )}

        {selectedTime && (
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
                marginBottom: "20px",
              }}
            >
              Select a Court
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
              }}
            >
              {venues.map((court) => (
                <CourtCard
                  key={court.name}
                  court={court}
                  selectedCourt={selectedCourt}
                  onCourtSelect={handleCourtSelect}
                />
              ))}
            </div>
          </div>
        )}

        <BookingSummary
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectedCourt={selectedCourt}
          bookingConfirmed={bookingConfirmed}
          onConfirmBooking={handleConfirmBooking}
        />
      </div>
    </div>
  );
}

export default ReservePage;
