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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  // =========================
  // LOAD EVENTS
  // =========================
  const loadEvents = async () => {
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
        title: e.title, // ❗ removed emoji to avoid styling weirdness
        start: e.startDatetime,
        end: e.endDatetime,

        extendedProps: {
          description: e.description,
          location: e.location,
          isPublic: e.isPublic,
          userId: e.userId
        },

        // ✅ clean consistent colors
        backgroundColor: e.isPublic ? "#4f46e5" : "#6b7280",
        borderColor: e.isPublic ? "#4f46e5" : "#6b7280",
        textColor: "#ffffff"
      }))
    );
  };

  useEffect(() => {
    if (user?.id) loadEvents();
  }, [user]);

  // =========================
  // CLICK EVENT
  // =========================
  const handleEventClick = (info) => {
    const e = info.event;

    const eventData = {
      id: e.id,
      title: e.title,
      description: e.extendedProps.description,
      location: e.extendedProps.location,
      startDatetime: e.startStr,
      endDatetime: e.endStr,
      isPublic: e.extendedProps.isPublic,
      userId: e.extendedProps.userId
    };

    setSelectedEvent(eventData);
    setEditData(eventData);
    setIsEditing(false);
  };

  // =========================
  // DELETE
  // =========================
  const deleteEvent = async () => {
    await fetch(
      `/api/events/${selectedEvent.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    setSelectedEvent(null);
    loadEvents();
  };

  // =========================
  // UPDATE
  // =========================
  const updateEvent = async (e) => {
    e.preventDefault();

    await fetch(
      `/api/events/${editData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(editData)
      }
    );

    setIsEditing(false);
    setSelectedEvent(null);
    loadEvents();
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ padding: "20px" }}>

      {/* =========================
          CALENDAR (NO STYLE CONFLICT)
      ========================= */}
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
        eventDisplay="block"   // ⭐ FIX: prevents weird inline stretching
      />

      {/* =========================
          CLEAN MODAL
      ========================= */}
      {selectedEvent && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>

          <div style={{
            width: 420,
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
          }}>

            {/* =========================
                VIEW MODE
            ========================= */}
            {!isEditing ? (
              <>
                <h2 style={{ marginBottom: 10 }}>
                  {selectedEvent.title}
                </h2>

                <p><b>Description:</b> {selectedEvent.description}</p>
                <p><b>Location:</b> {selectedEvent.location}</p>
                <p>
                  <b>Type:</b>{" "}
                  {selectedEvent.isPublic ? "Public" : "Private"}
                </p>

                {selectedEvent.userId === user.id && (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => setIsEditing(true)}>
                      Edit
                    </button>

                    <button onClick={deleteEvent}>
                      Delete
                    </button>
                  </div>
                )}

                <button
                  style={{ marginTop: 10 }}
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </button>
              </>
            ) : (
              /* =========================
                  EDIT MODE
              ========================= */
              <form onSubmit={updateEvent}>

                <h3>Edit Event</h3>

                <input
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      title: e.target.value
                    })
                  }
                />

                <input
                  value={editData.description || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      description: e.target.value
                    })
                  }
                />

                <input
                  value={editData.location || ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      location: e.target.value
                    })
                  }
                />

                <input
                  type="datetime-local"
                  value={editData.startDatetime}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      startDatetime: e.target.value
                    })
                  }
                />

                <input
                  type="datetime-local"
                  value={editData.endDatetime}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      endDatetime: e.target.value
                    })
                  }
                />

                <label>
                  Public:
                  <input
                    type="checkbox"
                    checked={editData.isPublic}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        isPublic: e.target.checked
                      })
                    }
                  />
                </label>

                <div style={{ display: "flex", gap: 10 }}>
                  <button type="submit">Save</button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default Calendar;