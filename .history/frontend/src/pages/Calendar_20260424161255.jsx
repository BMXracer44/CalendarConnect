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
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // =========================
  // FORMAT DATETIME FOR SPRING
  // =========================
  const formatDateTime = (value) => {
    if (!value) return null;
    return value.length === 16 ? value + ":00" : value;
  };

  // =========================
  // LOAD EVENTS
  // =========================
  const loadEvents = async () => {
    try {
      if (!user?.id) return;

      const res = await fetch(
        `http://localhost:8080/api/events/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      const data = await res.json();

      setEvents(
        data.map((e) => ({
          id: String(e.id), // ✅ FIX: force string ID (FullCalendar safe)
          title: e.isPublic ? e.title : `🔒 ${e.title}`,
          start: e.startDatetime,
          end: e.endDatetime,
          color: e.isPublic ? "#4f46e5" : "#6b7280",

          extendedProps: {
            description: e.description,
            location: e.location,
            isPublic: e.isPublic,
            userId: e.userId
          }
        }))
      );
    } catch (err) {
      console.error("Load events error:", err);
    }
  };

  useEffect(() => {
    if (user?.id) loadEvents();
  }, [user]);

  // =========================
  // EVENT CLICK
  // =========================
  const handleEventClick = (info) => {
    const e = info.event;

    setSelectedEvent({
      id: e.id, // already string
      title: e.title.replace("🔒 ", ""),
      description: e.extendedProps.description || "",
      location: e.extendedProps.location || "",
      startDatetime: e.startStr?.slice(0, 16),
      endDatetime: e.endStr?.slice(0, 16),
      isPublic: e.extendedProps.isPublic,
      userId: e.extendedProps.userId
    });

    setIsEditing(false);
    setShowViewModal(true);
  };

  // =========================
  // UPDATE EVENT (FIXED + SAFE)
  // =========================
  const updateEvent = async (e) => {
    e.preventDefault();

    // ❗ Prevent invalid request
    if (!selectedEvent?.id) {
      console.error("Missing event ID");
      alert("Cannot update: missing event ID");
      return;
    }

    const payload = {
      title: selectedEvent.title,
      description: selectedEvent.description,
      location: selectedEvent.location,
      startDatetime: formatDateTime(selectedEvent.startDatetime),
      endDatetime: formatDateTime(selectedEvent.endDatetime),
      isPublic: selectedEvent.isPublic
    };

    try {
      const url = `http://localhost:8080/api/events/${selectedEvent.id}`;

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Update failed:", res.status, errorText);

        if (res.status === 404) {
          alert("Event not found (404). It may have been deleted.");
        } else {
          alert("Update failed. Check backend logs.");
        }
        return;
      }

      setIsEditing(false);
      setShowViewModal(false);

      await loadEvents();

    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ padding: "20px" }}>

      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          bootstrap5Plugin
        ]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
      />

      {/* =========================
          MODAL
      ========================= */}
      {showViewModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h2>{isEditing ? "Edit Event" : "Event Details"}</h2>

            {!isEditing ? (
              <>
                <p><b>Title:</b> {selectedEvent.title}</p>
                <p><b>Description:</b> {selectedEvent.description}</p>
                <p><b>Location:</b> {selectedEvent.location}</p>
                <p><b>Start:</b> {selectedEvent.startDatetime}</p>
                <p><b>End:</b> {selectedEvent.endDatetime}</p>
                <p><b>Type:</b> {selectedEvent.isPublic ? "Public" : "Private"}</p>

                <div
                  onClick={() => setIsEditing(true)}
                  style={{ cursor: "pointer", fontSize: "22px", marginTop: "10px" }}
                >
                  ✏️
                </div>
              </>
            ) : (
              <form onSubmit={updateEvent}>

                <input
                  value={selectedEvent.title}
                  onChange={(e) =>
                    setSelectedEvent({ ...selectedEvent, title: e.target.value })
                  }
                />

                <input
                  value={selectedEvent.description}
                  onChange={(e) =>
                    setSelectedEvent({ ...selectedEvent, description: e.target.value })
                  }
                />

                <input
                  value={selectedEvent.location}
                  onChange={(e) =>
                    setSelectedEvent({ ...selectedEvent, location: e.target.value })
                  }
                />

                <input
                  type="datetime-local"
                  value={selectedEvent.startDatetime}
                  onChange={(e) =>
                    setSelectedEvent({ ...selectedEvent, startDatetime: e.target.value })
                  }
                />

                <input
                  type="datetime-local"
                  value={selectedEvent.endDatetime}
                  onChange={(e) =>
                    setSelectedEvent({ ...selectedEvent, endDatetime: e.target.value })
                  }
                />

                <label>
                  Public:
                  <input
                    type="checkbox"
                    checked={selectedEvent.isPublic}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        isPublic: e.target.checked
                      })
                    }
                  />
                </label>

                <button type="submit">Save Changes</button>
              </form>
            )}

            <button onClick={() => setShowViewModal(false)}>
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Calendar;