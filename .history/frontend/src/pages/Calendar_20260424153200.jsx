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

  const [openMenuId, setOpenMenuId] = useState(null);

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
  // CLICK EVENT (VIEW ONLY)
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
      setOpenMenuId(null);
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

  // =========================
  // EVENT RENDER (DROPDOWN MENU)
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
          width: "100%",
          position: "relative"
        }}
      >
        {/* TITLE */}
        <div
          style={{
            maxWidth: "70%",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            cursor: "pointer"
          }}
          onClick={() => handleEventClick(eventInfo)}
        >
          {e.title}
        </div>

        {/* DROPDOWN MENU */}
        {isOwner && (
          <div style={{ position: "relative" }}>

            <span
              style={{ cursor: "pointer", fontSize: "14px" }}
              onClick={(ev) => {
                ev.stopPropagation();
                setOpenMenuId(openMenuId === e.id ? null : e.id);
              }}
            >
              ⋮
            </span>

            {/* MENU */}
            {openMenuId === e.id && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: 20,
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  zIndex: 999,
                  width: 100
                }}
              >
                <div
                  style={{ padding: 5, cursor: "pointer" }}
                  onClick={() => {
                    setSelectedEvent({
                      id: e.id,
                      title: e.title.replace("🔒 ", ""),
                      description: data.description,
                      location: data.location,
                      startDatetime: e.startStr,
                      endDatetime: e.endStr,
                      isPublic: data.isPublic,
                      userId: data.userId
                    });

                    setOpenMenuId(null);
                  }}
                >
                  View
                </div>

                <div
                  style={{ padding: 5, cursor: "pointer" }}
                  onClick={() => {
                    setEditEvent({
                      id: e.id,
                      title: e.title.replace("🔒 ", ""),
                      description: data.description,
                      location: data.location,
                      startDatetime: e.startStr,
                      endDatetime: e.endStr,
                      isPublic: data.isPublic
                    });

                    setOpenMenuId(null);
                  }}
                >
                  Edit
                </div>

                <div
                  style={{ padding: 5, cursor: "pointer", color: "red" }}
                  onClick={() => deleteEvent(e.id)}
                >
                  Delete
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    );
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>

      {/* CALENDAR */}
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
          eventContent={renderEventContent}
          eventClick={handleEventClick}
        />
      </div>

      {/* SIDE PANEL (VIEW + EDIT) */}
      <div style={{ flex: 1, borderLeft: "1px solid #ddd", paddingLeft: 15 }}>

        {!selectedEvent ? (
          <p>Select an event</p>
        ) : !editEvent ? (
          <>
            <h2>{selectedEvent.title}</h2>
            <p>{selectedEvent.description}</p>
            <p>{selectedEvent.location}</p>
            <p>{selectedEvent.isPublic ? "Public" : "Private"}</p>

            <button onClick={() => setEditEvent(selectedEvent)}>
              Edit
            </button>
          </>
        ) : (
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

            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditEvent(null)}>
              Cancel
            </button>

          </form>
        )}

      </div>
    </div>
  );
}

export default Calendar;