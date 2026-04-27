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

  // ⭐ ONLY EDIT STATE (this fixes your issue)
  const [editEvent, setEditEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // =========================
  // LOAD EVENTS
  // =========================
  const loadEvents = async () => {
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
        id: e.id,
        title: e.isPublic ? e.title : `🔒 ${e.title}`,
        start: e.startDatetime,
        end: e.endDatetime,

        extendedProps: {
          description: e.description,
          location: e.location,
          isPublic: e.isPublic,
          userId: e.userId
        }
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
      title: e.title.replace("🔒 ", ""),
      description: e.extendedProps.description,
      location: e.extendedProps.location,
      startDatetime: e.startStr,
      endDatetime: e.endStr,
      isPublic: e.extendedProps.isPublic,
      userId: e.extendedProps.userId
    };

    setSelectedEvent(eventData);
    setEditEvent(eventData); // ⭐ IMPORTANT FIX
    setIsEditing(false);
  };

  // =========================
  // START EDIT
  // =========================
  const startEdit = () => {
    setIsEditing(true);
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const cancelEdit = () => {
    setIsEditing(false);
    setEditEvent(selectedEvent); // reset safely
  };

  // =========================
  // DELETE
  // =========================
  const deleteEvent = async () => {
    const res = await fetch(
      `http://localhost:8080/api/events/${selectedEvent.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    if (res.ok) {
      setSelectedEvent(null);
      setEditEvent(null);
      loadEvents();
    }
  };

  // =========================
  // UPDATE (FIXED — THIS WAS YOUR BUG)
  // =========================
  const updateEvent = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:8080/api/events/${editEvent.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(editEvent) // ⭐ ALWAYS EDIT EVENT ONLY
      }
    );

    if (!res.ok) {
      console.error(await res.text());
      alert("Update failed");
      return;
    }

    setIsEditing(false);
    setSelectedEvent(null);
    setEditEvent(null);
    loadEvents();
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>

      {/* =========================
          CALENDAR
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
          SIDE PANEL / POPUP AREA
      ========================= */}
      <div style={{ flex: 1, borderLeft: "1px solid #ddd", paddingLeft: 15 }}>

        {!selectedEvent ? (
          <p>Click an event</p>
        ) : !isEditing ? (
          <>
            {/* VIEW MODE */}
            <h2>{selectedEvent.title}</h2>

            <p>{selectedEvent.description}</p>
            <p>{selectedEvent.location}</p>
            <p>{selectedEvent.isPublic ? "Public" : "Private"}</p>

            {selectedEvent.userId === user.id && (
              <>
                <button onClick={startEdit}>Edit</button>
                <button onClick={deleteEvent}>Delete</button>
              </>
            )}

            <button onClick={() => setSelectedEvent(null)}>
              Close
            </button>
          </>
        ) : (
          <>
            {/* EDIT MODE (FIXED) */}
            <form onSubmit={updateEvent}>

              <h3>Edit Event</h3>

              <input
                value={editEvent.title}
                onChange={(e) =>
                  setEditEvent({
                    ...editEvent,
                    title: e.target.value
                  })
                }
              />

              <input
                value={editEvent.description || ""}
                onChange={(e) =>
                  setEditEvent({
                    ...editEvent,
                    description: e.target.value
                  })
                }
              />

              <input
                value={editEvent.location || ""}
                onChange={(e) =>
                  setEditEvent({
                    ...editEvent,
                    location: e.target.value
                  })
                }
              />

              <input
                type="datetime-local"
                value={editEvent.startDatetime}
                onChange={(e) =>
                  setEditEvent({
                    ...editEvent,
                    startDatetime: e.target.value
                  })
                }
              />

              <input
                type="datetime-local"
                value={editEvent.endDatetime}
                onChange={(e) =>
                  setEditEvent({
                    ...editEvent,
                    endDatetime: e.target.value
                  })
                }
              />

              <label>
                Public:
                <input
                  type="checkbox"
                  checked={editEvent.isPublic}
                  onChange={(e) =>
                    setEditEvent({
                      ...editEvent,
                      isPublic: e.target.checked
                    })
                  }
                />
              </label>

              <button type="submit">Save</button>
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>

            </form>
          </>
        )}

      </div>
    </div>
  );
}

export default Calendar;