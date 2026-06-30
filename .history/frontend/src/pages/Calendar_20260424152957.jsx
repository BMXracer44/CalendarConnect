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
  const [editEvent, setEditEvent] = useState(null);

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
        title: e.isPublic ? e.title : `🔒 ${e.title}`,
        start: e.startDatetime,
        end: e.endDatetime,

        description: e.description,
        location: e.location,
        isPublic: e.isPublic,
        userId: e.userId
      }))
    );
  };

  useEffect(() => {
    if (user?.id) loadEvents();
  }, [user]);

  // =========================
  // CLICK EVENT (THIS IS NOW RELIABLE)
  // =========================
  const handleEventClick = (info) => {
    const e = info.event;

    setSelectedEvent({
      id: e.id,
      title: e.title.replace("🔒 ", ""),
      description: e.extendedProps.description,
      location: e.extendedProps.location,
      startDatetime: e.startStr,
      endDatetime: e.endStr,
      isPublic: e.extendedProps.isPublic,
      userId: e.extendedProps.userId
    });

    setEditEvent(null);
  };

  // =========================
  // DELETE
  // =========================
  const deleteEvent = async (id) => {
    const res = await fetch(
      `/api/events/${id}`,
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
  // UPDATE
  // =========================
  const updateEvent = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `/api/events/${editEvent.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(editEvent)
      }
    );

    if (res.ok) {
      setEditEvent(null);
      setSelectedEvent(null);
      loadEvents();
    }
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
          SIDE PANEL (DETAILS)
      ========================= */}
      <div style={{
        flex: 1,
        borderLeft: "1px solid #ddd",
        paddingLeft: "15px"
      }}>

        {!selectedEvent ? (
          <p>Click an event to view details</p>
        ) : editEvent ? (
          /* EDIT MODE */
          <form onSubmit={updateEvent}>

            <h3>Edit Event</h3>

            <input
              value={editEvent.title}
              onChange={(e) =>
                setEditEvent({ ...editEvent, title: e.target.value })
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
            <button type="button" onClick={() => setEditEvent(null)}>
              Cancel
            </button>

          </form>

        ) : (
          /* VIEW MODE */
          <div>
            <h2>{selectedEvent.title}</h2>

            <p>{selectedEvent.description}</p>
            <p>{selectedEvent.location}</p>
            <p>
              {selectedEvent.isPublic ? "Public" : "Private"}
            </p>

            {selectedEvent.userId === user.id && (
              <>
                <button onClick={() => setEditEvent(selectedEvent)}>
                  Edit
                </button>

                <button onClick={() => deleteEvent(selectedEvent.id)}>
                  Delete
                </button>
              </>
            )}

            <button onClick={() => setSelectedEvent(null)}>
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Calendar;