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
  const [expandedEventId, setExpandedEventId] = useState(null);

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
  // DELETE EVENT
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

    if (res.ok) loadEvents();
  };

  // =========================
  // UPDATE EVENT (simple inline save)
  // =========================
  const saveEvent = async (event) => {
    const res = await fetch(
      `/api/events/${event.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(event)
      }
    );

    if (res.ok) {
      setEditEvent(null);
      loadEvents();
    }
  };

  // =========================
  // CLICK EVENT → EXPAND
  // =========================
  const handleEventClick = (info) => {
    const id = info.event.id;
    setExpandedEventId((prev) => (prev === id ? null : id));
  };

  // =========================
  // INLINE EVENT RENDER
  // =========================
  const renderEventContent = (eventInfo) => {
    const e = eventInfo.event;
    const isExpanded = expandedEventId === e.id;

    const data = e.extendedProps;

    return (
      <div
        style={{
          fontSize: "12px",
          padding: "2px"
        }}
      >
        {/* TITLE */}
        <b>{e.title}</b>

        {/* CLICK TO EXPAND DETAILS */}
        {isExpanded && (
          <div style={{ marginTop: "5px" }}>

            {editEvent?.id === e.id ? (
              <>
                {/* EDIT MODE */}
                <input
                  value={editEvent.title}
                  onChange={(x) =>
                    setEditEvent({
                      ...editEvent,
                      title: x.target.value
                    })
                  }
                />

                <input
                  value={editEvent.description || ""}
                  onChange={(x) =>
                    setEditEvent({
                      ...editEvent,
                      description: x.target.value
                    })
                  }
                />

                <button onClick={() => saveEvent(editEvent)}>
                  Save
                </button>

                <button onClick={() => setEditEvent(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                {/* VIEW MODE */}
                <div>{data.description}</div>
                <div>{data.location}</div>
                <div>
                  {data.isPublic ? "Public" : "Private"}
                </div>

                {/* OWNER CONTROLS */}
                {data.userId === user.id && (
                  <div style={{ marginTop: "5px" }}>
                    <button onClick={() => setEditEvent({
                      id: e.id,
                      title: e.title.replace("🔒 ", ""),
                      description: data.description,
                      location: data.location,
                      isPublic: data.isPublic
                    })}>
                      Edit
                    </button>

                    <button onClick={() => deleteEvent(e.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
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
        eventContent={renderEventContent} // ⭐ KEY PART
      />

    </div>
  );
}

export default Calendar;