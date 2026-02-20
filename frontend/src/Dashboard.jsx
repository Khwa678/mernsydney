
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("Sydney");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ✅ Handle Google token
  const urlToken = new URLSearchParams(window.location.search).get("token");

  if (urlToken) {
    localStorage.setItem("token", urlToken);
  }

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const importEvent = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/events/import/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Event Imported Successfully ✅");
      fetchEvents();
    } catch (err) {
      alert("Import failed");
      console.log(err);
    }
  };

  const getStatusColor = (status) => {
    if (status === "new") return "green";
    if (status === "updated") return "orange";
    if (status === "inactive") return "red";
    if (status === "imported") return "blue";
    return "gray";
  };

  // 🔎 Filtered events
  const filteredEvents = events
    .filter((event) =>
      event.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((event) =>
      cityFilter === "All" ? true : event.city === cityFilter
    );

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Admin Dashboard</h1>

      {/* 🔹 Filters Section */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", width: "250px" }}
        />

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          style={{ marginLeft: "20px", padding: "8px" }}
        >
          <option value="Sydney">Sydney</option>
          <option value="All">All Cities</option>
        </select>
      </div>

      {/* 🔹 Analytics Header */}
      <div style={{ marginBottom: "20px" }}>
        <strong>Total:</strong> {events.length} |{" "}
        <strong>New:</strong>{" "}
        {events.filter((e) => e.status === "new").length} |{" "}
        <strong>Updated:</strong>{" "}
        {events.filter((e) => e.status === "updated").length} |{" "}
        <strong>Imported:</strong>{" "}
        {events.filter((e) => e.status === "imported").length} |{" "}
        <strong>Inactive:</strong>{" "}
        {events.filter((e) => e.status === "inactive").length}
      </div>

      {/* 🔹 Events Table */}
      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left"
        }}
      >
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Source</th>
            <th>Imported By</th>
            <th>Imported At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredEvents.map((event) => (
            <tr
              key={event._id}
              onClick={() => setSelectedEvent(event)}
              style={{ cursor: "pointer" }}
            >
              <td>{event.title}</td>

              <td>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "5px",
                    color: "white",
                    backgroundColor: getStatusColor(event.status)
                  }}
                >
                  {event.status}
                </span>
              </td>

              <td>{event.sourceWebsite}</td>

              <td>{event.importedBy || "-"}</td>

              <td>
                {event.importedAt
                  ? new Date(event.importedAt).toLocaleString()
                  : "-"}
              </td>

              <td>
                {event.status !== "imported" ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      importEvent(event._id);
                    }}
                    style={{
                      padding: "6px 10px",
                      background: "black",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer"
                    }}
                  >
                    Import
                  </button>
                ) : (
                  <span style={{ color: "blue" }}>✔ Imported</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Preview Panel */}
      {selectedEvent && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px"
          }}
        >
          <h2>{selectedEvent.title}</h2>
          <p><strong>Description:</strong> {selectedEvent.description || "No description available"}</p>
          <p><strong>Venue:</strong> {selectedEvent.venueName || "-"}</p>
          <p><strong>City:</strong> {selectedEvent.city || "-"}</p>
          <p><strong>Source:</strong> {selectedEvent.sourceWebsite}</p>

          <button
            onClick={() => window.open(selectedEvent.originalUrl, "_blank")}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            View Original Event
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;