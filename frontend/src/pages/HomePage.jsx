import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
        Welcome to UCD Gym Booking
      </h1>

      <div
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        <img
          src="/images/home.png"
          alt="Hero"
          style={{
            width: "100%",
            maxHeight: "580px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "16px",
          }}
        />
        <p style={{ color: "#cbd5e1" }}>
          Explore venues, check availability, and reserve your favorite court.
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "16px",
          padding: "24px",
        }}
      >
        <h2>Location</h2>
        <p style={{ color: "#cbd5e1" }}>
          Our sports center is located on Belfield campus.
        </p>
        <div
          style={{
            height: "250px",
            backgroundColor: "#334155",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#e2e8f0",
          }}
        >
          <iframe
            title="UCD Sport and Fitness Map"
            src="http://www.google.com/maps?q=UCD%20Sport%20and%20Fitness%20Dublin&output=embed"
            width="100%"
            height="300"
            style={{
              border: 0,
              borderRadius: "12px",
            }}
            allowFullScreen=""
            loading="lazy"   // wait until user scroll down to this section then load
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "16px",
          padding: "24px",
          marginTop: "24px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "12px" }}>
          Ready to book your court?
        </h2>

        <p
          style={{
            color: "#cbd5e1",
            marginBottom: "18px",
          }}
        >
          Check availability and reserve your preferred venue in just a few
          steps.
        </p>

        <Link
        to="/reserve"
        style={{
          display: "inline-block",
          borderRadius: "10px",
          padding: "12px 20px",
          backgroundColor: "#16a34a",
          color: "white",
          fontWeight: "bold",
          textDecoration: "none",
        }}
        >
          Reserve Now
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
