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
  const [editEvent, setEditEvent] = useState(null);

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
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.id) loadEvents();
  }, [user]);

  // =========================
  // DELETE EVENT
  // =========================
  const deleteEvent = async (id) => {
    const res = await fetch(
      `http://localhost:8080/api/events/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    if (res.ok) loadEvents();
  };

  // =========================
  // UPDATE EVENT
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
        body: JSON.stringify(editEvent)
      }
    );

    if (res.ok) {
      setEditEvent(null);
      loadEvents();
    }
  };

  // =========================
  // INLINE EVENT CONTENT
  // =========================
  const renderEventContent = (eventInfo) => {
    const e = eventInfo.event;
    const data = e.extendedProps;

    const isOwner = data.userId === user.id;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
          padding: "2px",
          width: "100%"
        }}
      >
        {/* TITLE */}
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "65%"
          }}
        >
          {e.title}
        </div>

        {/* ICONS */}
        {isOwner && (
          <div style={{ display: "flex", gap: "5px" }}>

            {/* EDIT */}
            <span
              style={{ cursor: "pointer" }}
              title="Edit"
              onClick={(ev) => {
                ev.stopPropagation();

                setEditEvent({
                  id: e.id,
                  title: e.title.replace("🔒 ", ""),
                  description: data.description,
                  location: data.location,
                  startDatetime: e.startStr,
                  endDatetime: e.endStr,
                  isPublic: data.isPublic
                });
              }}
            >
              ✏️
            </span>

            {/* DELETE */}
            <span
              style={{ cursor: "pointer" }}
              title="Delete"
              onClick={(ev) => {
                ev.stopPropagation();
                deleteEvent(e.id);
              }}
            >
              🗑️
            </span>

          </div>
        )}
      </div>
    );
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ padding: "20px" }}>

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
        eventContent={renderEventContent}
      />

      {/* =========================
          EDIT PANEL (SIMPLE)
      ========================= */}
      {editEvent && (
        <div style={{
          position: "fixed",
          right: 20,
          top: 100,
          width: 300,
          background: "white",
          padding: 15,
          border: "1px solid #ddd",
          borderRadius: 8
        }}>
          <h3>Edit Event</h3>

          <form onSubmit={updateEvent}>

            <input
              value={editEvent.title}
              onChange={(e) =>
                setEditEvent({ ...editEvent, title: e.target.value })
              }
            />

            <input
              value={editEvent.description || ""}
              onChange={(e) =>
                setEditEvent({ ...editEvent, description: e.target.value })
              }
            />

            <input
              value={editEvent.location || ""}
              onChange={(e) =>
                setEditEvent({ ...editEvent, location: e.target.value })
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

            <button
              type="button"
              onClick={() => setEditEvent(null)}
            >
              Cancel
            </button>

          </form>
        </div>
      )}

    </div>
  );
}

export default Calendar;