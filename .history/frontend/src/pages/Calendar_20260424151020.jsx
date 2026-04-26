import { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";

import { AuthContext } from "../context/AuthContext";

function Calendar() {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDatetime: "",
    endDatetime: "",
    isPublic: true
  });

  // =========================
  // LOAD EVENTS
  // =========================
  const loadEvents = async () => {
    try {
      if (!user?.id) return;

      const res = await fetch(
        `http://localhost:8080/api/events`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("LOAD EVENTS ERROR:", text);
        return;
      }

      const data = await res.json();

      // ✅ Show public events + user's private events
      const filtered = data.filter(
        (e) => e.isPublic || e.userId === user.id
      );

      setEvents(
        filtered.map((e) => ({
          id: e.id,
          title: e.isPublic ? e.title : `🔒 ${e.title}`,
          start: e.startDatetime,
          end: e.endDatetime,
          color: e.isPublic ? "#4f46e5" : "#6b7280"
        }))
      );
    } catch (err) {
      console.error("LOAD EVENTS FAILED:", err);
    }
  };

  useEffect(() => {
    if (user?.id) loadEvents();
  }, [user]);

  // =========================
  // DATE CLICK
  // =========================
  function handleDateClick(info) {
    setFormData((prev) => ({
      ...prev,
      startDatetime: info.dateStr
    }));
  }

  // =========================
  // OPEN MODAL
  // =========================
  const openModal = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      startDatetime: "",
      endDatetime: "",
      isPublic: true
    });
    setShowModal(true);
  };

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // =========================
  // CREATE EVENT
  // =========================
  const createEvent = async (e) => {
    e.preventDefault();

    try {
      if (!user?.id) {
        alert("User not loaded. Please log in again.");
        return;
      }

      const res = await fetch(
        `http://localhost:8080/api/events?userId=${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            location: formData.location,
            startDatetime: formData.startDatetime,
            endDatetime: formData.endDatetime,
            isPublic: formData.isPublic // ✅ FIXED
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create event");
        return;
      }

      setShowModal(false);
      loadEvents();
    } catch (err) {
      console.error("CREATE EVENT ERROR:", err);
      alert("Server error creating event");
    }
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px"
        }}
      >
        <h1>My Calendar</h1>

        <button
          onClick={openModal}
          style={{
            padding: "10px 15px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          + Add Event
        </button>
      </div>

      {/* CALENDAR */}
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          bootstrap5Plugin
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev next today",
          center: "title",
          right: "dayGridMonth timeGridWeek timeGridDay"
        }}
        editable={true}
        selectable={true}
        events={events}
        dateClick={handleDateClick}
      />

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Add Event</h2>

            <form onSubmit={createEvent}>
              <input
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <input
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
              />

              <input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
              />

              <input
                type="datetime-local"
                name="startDatetime"
                value={formData.startDatetime}
                onChange={handleChange}
                required
              />

              <input
                type="datetime-local"
                name="endDatetime"
                value={formData.endDatetime}
                onChange={handleChange}
                required
              />

              <label>
                Public Event:
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                />
              </label>

              <button type="submit">Create</button>

              <button
                type="button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;