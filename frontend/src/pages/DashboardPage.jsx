import {
  countByField,
  countByMonth,
  countByWeekday,
  getTopLabel,
} from "../utils/dashboardUtils";

import { useState, useEffect } from "react";

function DashboardPage({ bookings }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  if (bookings.length === 0) {
    return (
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center" }}>Admin Dashboard</h1>

        <p
          style={{
            textAlign: "center",
            color: "#cbd5e1",
            marginTop: "24px",
          }}
        >
          No booking data available yet.
        </p>
      </div>
    );
  }

  const courtCounts = countByField(bookings, "court");
  const timeCounts = countByField(bookings, "time");
  const monthCounts = countByMonth(bookings);
  const weekdayCounts = countByWeekday(bookings);

  const sortedTimeCounts = Object.entries(timeCounts).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  const weekdayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const sortedWeekdayCounts = weekdayOrder
    .filter((day) => weekdayCounts[day] !== undefined)
    .map((day) => [day, weekdayCounts[day]]);

  const mostPopularCourt = getTopLabel(courtCounts);
  const peakTimeSlot = getTopLabel(timeCounts);

  const renderBars = (data, sortedEntries = null) => {
    const entries = sortedEntries || Object.entries(data);
    const values = entries.map(([, value]) => value);

    if (values.length === 0) {
      return <p style={{ color: "#cbd5e1" }}>No data available.</p>;
    }
    const maxValue = Math.max(...values);

    return (
      <div>
        {entries.map(([label, value]) => (
          <div key={label} style={{ marginBottom: "14px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <span>{label}</span>
              <span>{value}</span>
            </div>

            <div
              style={{
                height: "10px",
                backgroundColor: "#334155",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(value / maxValue) * 100}%`,
                  height: "100%",
                  backgroundColor: "#38bdf8",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>
        Admin Dashboard
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#cbd5e1",
          marginBottom: "30px",
        }}
      >
        Booking analytics based on real reservation data from MongoDB.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Bookings</h3>
          <p style={numberStyle}>{bookings.length}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Users</h3>
          <p style={numberStyle}>{users.length}</p>
        </div>

        <div style={cardStyle}>
          <h3>Most Popular Court</h3>
          <p style={numberStyle}>{mostPopularCourt}</p>
        </div>

        <div style={cardStyle}>
          <h3>Peak Time Slot</h3>
          <p style={numberStyle}>{peakTimeSlot}</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h2>Bookings by Court</h2>
          {renderBars(courtCounts)}
        </div>

        <div style={cardStyle}>
          <h2>Bookings by Time Slot</h2>
          {renderBars(timeCounts, sortedTimeCounts)}
        </div>

        <div style={cardStyle}>
          <h2>Bookings by Month</h2>
          {renderBars(monthCounts)}
        </div>

        <div style={cardStyle}>
          <h2>Bookings by Weekday</h2>
          {renderBars(weekdayCounts, sortedWeekdayCounts)}
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#1e293b",
  borderRadius: "16px",
  padding: "20px",
};

const numberStyle = {
  fontSize: "28px",
  fontWeight: "bold",
  margin: 0,
};

export default DashboardPage;
