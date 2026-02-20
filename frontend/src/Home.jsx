import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/events")
      .then(res => setEvents(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleSubmit = async () => {
    if (!email || !consent) {
      alert("Please enter email and accept consent");
      return;
    }

    await axios.post("http://localhost:5000/api/subscribe", {
      email,
      consent,
      eventId: selectedEvent._id
    });

    window.open(selectedEvent.originalUrl, "_blank");

    setSelectedEvent(null);
    setEmail("");
    setConsent(false);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Sydney Events</h1>
<button
  onClick={() =>
    window.location.href = "http://localhost:5000/auth/google"
  }
  style={{
    marginBottom: "20px",
    padding: "8px 15px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }}
>
  Admin Login
</button>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px"
      }}>
        {events.map(event => (
          <div key={event._id}
            style={{
              border: "1px solid #eee",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
            }}
          >
            <h3>{event.title}</h3>
            <p><strong>City:</strong> {event.city}</p>
            <p><strong>Source:</strong> {event.sourceWebsite}</p>



            <button
              onClick={() => setSelectedEvent(event)}
              style={{
                marginTop: "10px",
                padding: "10px 15px",
                backgroundColor: "black",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              GET TICKETS
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            width: "300px"
          }}>
            <h3>Enter Email</h3>

            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />

            <label>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              /> I agree to receive updates
            </label>

            <br /><br />

            <button onClick={handleSubmit}
              style={{
                padding: "8px 12px",
                background: "black",
                color: "white",
                border: "none",
                borderRadius: "5px"
              }}>
              Continue
            </button>

            <button
              onClick={() => setSelectedEvent(null)}
              style={{
                marginLeft: "10px",
                padding: "8px 12px"
              }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;