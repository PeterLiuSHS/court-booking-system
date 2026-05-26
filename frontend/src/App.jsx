import { useEffect, useState } from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import VenuesPage from "./pages/VenuesPage";
import ReservePage from "./pages/ReservePage";
import MyBookingsPage from "./pages/MyBookingsPage";
import BookingsPage from "./pages/BookingsPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  // JSON.parse() convert the string to an object
  const savedUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const [currentUser, setCurrentUser] = useState(savedUser);

  const [bookings, setBookings] = useState([]);

  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings");   // wait until backend does respond something
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();

    const fetchVenues = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/venues");
        const data = await response.json();
        setVenues(data);
      } catch (error){
        console.error("Error fetching venues:", error);
      };
    };

    fetchVenues();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        padding: "24px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto 24px auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/" style={navLinkStyle}>
            Home
          </Link>
          <Link to="/venues" style={navLinkStyle}>
            Venues
          </Link>
          <Link to="/reserve" style={navLinkStyle}>
            Reserve
          </Link>
          {currentUser?.role === "user" && (
            <Link to="/my-bookings" style={navLinkStyle}>
              My Bookings
            </Link>
          )}

          {currentUser?.role === "admin" && (
            <Link to="/bookings" style={navLinkStyle}>
              Bookings
            </Link>
          )}

          {currentUser?.role === "admin" && (
            <Link to="/dashboard" style={navLinkStyle}>
              Dashboard
            </Link>
          )}
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {currentUser ? (
            <>
              <span>{currentUser.email}</span>
              <span>Role: {currentUser.role}</span>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  localStorage.removeItem("currentUser");
                  localStorage.removeItem("token");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>
                Login
              </Link>
              <Link to="/register" style={navLinkStyle}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/venues" element={<VenuesPage venues={venues} />} />

        <Route
          path="/reserve"
          element={
            <ReservePage
              bookings={bookings}
              setBookings={setBookings}
              currentUser={currentUser}
              venues={venues}
            />
          }
        />

        <Route
          path="/my-bookings"
          element={
            !currentUser ? (
              <Navigate to="/login"/>
            ) : currentUser.role === "user" ?(
              <MyBookingsPage
              bookings={bookings}
              setBookings={setBookings}
              currentUser={currentUser} 
              />
            ) : (
              <Navigate to="/bookings"></Navigate>
            )
          }
        />

        <Route
          path="/bookings"
          element={
            !currentUser ? (
              <Navigate to="/login" />
            ) : currentUser?.role === "admin" ? (
              <BookingsPage bookings={bookings} setBookings={setBookings} />
            ) : (
              <MyBookingsPage
                bookings={bookings}
                setBookings={setBookings}
                currentUser={currentUser}
              />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            !currentUser ? (
              <Navigate to="/login" />
            ) : currentUser.role === "admin" ? (
              <DashboardPage bookings={bookings} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/login"
          element={<LoginPage setCurrentUser={setCurrentUser} />}
        />

        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

const navLinkStyle = {
  backgroundColor: "#e5e7eb",
  color: "#111827",
  padding: "8px 12px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "bold",
};

export default App;
