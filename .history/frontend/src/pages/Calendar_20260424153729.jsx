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
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDatetime: "",
    endDatetime: "",
    isPublic: true
  });

  // =========================
  // ICON STYLE
  // =========================
  const iconButton = {
    cursor: "pointer",
    fontSize: "18px",
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #e5e5e5",
    background: "#fff",
    transition: "0.2s"
  };

  // =========================
  // LOAD EVENTS
  // =========================
  const loadEvents = async () => {
    try {
      if (!user?.id) return;

      const res = await fetch(
        `/api/events/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      if (!res.ok) {
        console.error(await res.text());
        return;
      }

      const data = await res.json();

      setEvents(
        data.map((e) => ({
          id: e.id,
          title: e.isPublic ? e.title : `🔒 ${e.title}`,
          start: e.startDatetime,
          end: e.endDatetime,
          color: e.isPublic ? "#4f46e5" : "#6b7280",

          description: e.description,
          location: e.location,
          isPublic: e.isPublic,
          userId: e.userId
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
  // CREATE EVENT
  // =========================
  const createEvent = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `/api/events?userId=${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (!res.ok) {
        alert("Failed to create event");
        return;
      }

      setShowModal(false);
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // EVENT CLICK
  // =========================
  const handleEventClick = (info) => {
    const e = info.event;

    setSelectedEvent({
      id: e.id,
      title: e.title.replace("🔒 ", ""),
      startDatetime: e.startStr,
      endDatetime: e.endStr,
      description: e.extendedProps.description,
      location: e.extendedProps.location,
      isPublic: e.extendedProps.isPublic,
      userId: e.extendedProps.userId
    });

    setIsEditing(false);
    setShowViewModal(true);
  };

  // =========================
  // DELETE EVENT
  // =========================
  const deleteEvent = async () => {
    if (!window.confirm("Delete this event?")) return;

    const res = await fetch(
      `/api/events/${selectedEvent.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    if (res.ok) {
      setShowViewModal(false);
      setSelectedEvent(null);
      loadEvents();
    }
  };

  // =========================
  // UPDATE EVENT
  // =========================
  const updateEvent = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `/api/events/${selectedEvent.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(selectedEvent)
      }
    );

    if (res.ok) {
      setIsEditing(false);
      setShowViewModal(false);
      loadEvents();
    }
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ padding: "20px" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>My Calendar</h1>

        <button onClick={() => setShowModal(true)}>
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
        events={events}
        eventClick={handleEventClick}
      />

      {/* =========================
          VIEW / EDIT MODAL
      ========================= */}
      {showViewModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h2>
              {isEditing ? "Edit Event" : "Event Details"}
            </h2>

            {/* =========================
                VIEW MODE
            ========================= */}
            {!isEditing ? (
              <>
                <p><b>Title:</b> {selectedEvent.title}</p>
                <p><b>Description:</b> {selectedEvent.description}</p>
                <p><b>Location:</b> {selectedEvent.location}</p>
                <p><b>Start:</b> {selectedEvent.startDatetime}</p>
                <p><b>End:</b> {selectedEvent.endDatetime}</p>
                <p>
                  <b>Type:</b>{" "}
                  {selectedEvent.isPublic ? "Public" : "Private"}
                </p>
              </>
            ) : (
              /* =========================
                  EDIT MODE
              ========================= */
              <form onSubmit={updateEvent}>

                <input
                  value={selectedEvent.title}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      title: e.target.value
                    })
                  }
                />

                <input
                  value={selectedEvent.description}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      description: e.target.value
                    })
                  }
                />

                <input
                  value={selectedEvent.location}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      location: e.target.value
                    })
                  }
                />

                <input
                  type="datetime-local"
                  value={selectedEvent.startDatetime}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      startDatetime: e.target.value
                    })
                  }
                />

                <input
                  type="datetime-local"
                  value={selectedEvent.endDatetime}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      endDatetime: e.target.value
                    })
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

                <button type="submit">Save</button>
              </form>
            )}

            {/* =========================
                ICON ACTIONS (NEW)
            ========================= */}
            {selectedEvent.userId === user.id && !isEditing && (
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>

                <span
                  style={iconButton}
                  title="Edit Event"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️
                </span>

                <span
                  style={iconButton}
                  title="Delete Event"
                  onClick={deleteEvent}
                >
                  🗑️
                </span>

              </div>
            )}

            <button
              style={{ marginTop: "10px" }}
              onClick={() => setShowViewModal(false)}
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Calendar;