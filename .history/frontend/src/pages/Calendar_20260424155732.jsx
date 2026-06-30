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

      const data = await res.json();

      setEvents(
        data.map((e) => ({
          id: e.id,
          title: e.isPublic ? e.title : `🔒 ${e.title}`,
          start: e.startDatetime,
          end: e.endDatetime,
          color: e.isPublic ? "#4f46e5" : "#6b7280",

          // IMPORTANT: FullCalendar requires extendedProps for custom data
          extendedProps: {
            description: e.description,
            location: e.location,
            isPublic: e.isPublic,
            userId: e.userId
          }
        }))
      );
    } catch (err) {
      console.error(err);
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
      id: e.id,
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
  // UPDATE EVENT (BACKEND = update)
  // =========================
  const updateEvent = async (e) => {
    e.preventDefault();

    const payload = {
      title: selectedEvent.title,
      description: selectedEvent.description,
      location: selectedEvent.location,
      startDatetime: selectedEvent.startDatetime,
      endDatetime: selectedEvent.endDatetime,
      isPublic: selectedEvent.isPublic
    };

    await fetch(
      `/api/events/${selectedEvent.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      }
    );

    setIsEditing(false);
    setShowViewModal(false);
    loadEvents();
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
          VIEW / EDIT MODAL
      ========================= */}
      {showViewModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h2>{isEditing ? "Edit Event" : "Event Details"}</h2>

            {/* ================= VIEW MODE ================= */}
            {!isEditing ? (
              <>
                <p><b>Title:</b> {selectedEvent.title}</p>
                <p><b>Description:</b> {selectedEvent.description}</p>
                <p><b>Location:</b> {selectedEvent.location}</p>
                <p><b>Start:</b> {selectedEvent.startDatetime}</p>
                <p><b>End:</b> {selectedEvent.endDatetime}</p>
                <p><b>Type:</b> {selectedEvent.isPublic ? "Public" : "Private"}</p>

                {/* EDIT BUTTON (always visible now) */}
                <div className="event-actions">
                  <div
                    className="event-icon edit"
                    onClick={() => setIsEditing(true)}
                    title="Edit Event"
                    style={{
                      cursor: "pointer",
                      fontSize: "22px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "12px"
                    }}
                  >
                    ✏️
                  </div>
                </div>
              </>
            ) : (
              /* ================= EDIT MODE ================= */
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