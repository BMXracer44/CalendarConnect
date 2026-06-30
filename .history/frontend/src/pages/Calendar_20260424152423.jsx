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
        `/api/events/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      if (!res.ok) return;

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
      console.error(err);
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

    if (res.ok) {
      loadEvents();
      setFormData({
        title: "",
        description: "",
        location: "",
        startDatetime: "",
        endDatetime: "",
        isPublic: true
      });
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
  };

  // =========================
  // DELETE EVENT
  // =========================
  const deleteEvent = async () => {
    if (!window.confirm("Delete event?")) return;

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
      loadEvents();
    }
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>

      {/* =========================
          LEFT: CALENDAR
      ========================= */}
      <div style={{ flex: 2 }}>
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
      </div>

      {/* =========================
          RIGHT: SIDE PANEL
      ========================= */}
      <div
        style={{
          flex: 1,
          borderLeft: "1px solid #ddd",
          paddingLeft: "15px",
          minHeight: "600px"
        }}
      >

        {!selectedEvent ? (
          <p>Select an event to view details</p>
        ) : (
          <>
            {/* VIEW MODE */}
            {!isEditing ? (
              <div>
                <h2>{selectedEvent.title}</h2>

                <p><b>Description:</b> {selectedEvent.description}</p>
                <p><b>Location:</b> {selectedEvent.location}</p>
                <p><b>Start:</b> {selectedEvent.startDatetime}</p>
                <p><b>End:</b> {selectedEvent.endDatetime}</p>
                <p>
                  <b>Type:</b>{" "}
                  {selectedEvent.isPublic ? "Public" : "Private"}
                </p>

                {/* OWNER ACTIONS */}
                {selectedEvent.userId === user.id && (
                  <>
                    <button onClick={() => setIsEditing(true)}>
                      Edit
                    </button>

                    <button onClick={deleteEvent}>
                      Delete
                    </button>
                  </>
                )}

                <button onClick={() => setSelectedEvent(null)}>
                  Close
                </button>
              </div>
            ) : (
              /* EDIT MODE */
              <form onSubmit={updateEvent}>
                <h3>Edit Event</h3>

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
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Calendar;