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
    try {
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
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.id) loadEvents();
  }, [user]);

  // =========================
  // CLICK EVENT → OPEN POPUP
  // =========================
  const handleEventClick = (info) => {
    const e = info.event;

    const eventObj = {
      id: e.id,
      title: e.title.replace("🔒 ", ""),
      description: e.extendedProps.description,
      location: e.extendedProps.location,
      startDatetime: e.startStr,
      endDatetime: e.endStr,
      isPublic: e.extendedProps.isPublic,
      userId: e.extendedProps.userId
    };

    setSelectedEvent(eventObj);
    setEditData(eventObj);
    setIsEditing(false);
  };

  // =========================
  // DELETE EVENT
  // =========================
  const deleteEvent = async () => {
    try {
      const res = await fetch(
        `/api/events/${selectedEvent.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      if (!res.ok) {
        console.error(await res.text());
        alert("Delete failed");
        return;
      }

      setSelectedEvent(null);
      setEditData(null);
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // UPDATE EVENT
  // =========================
  const updateEvent = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
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

      if (!res.ok) {
        console.error(await res.text());
        alert("Update failed");
        return;
      }

      setIsEditing(false);
      setSelectedEvent(null);
      setEditData(null);
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ padding: "20px" }}>

      {/* =========================
          CALENDAR
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
      />

      {/* =========================
          POPUP MODAL
      ========================= */}
      {selectedEvent && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>

          <div style={{
            background: "white",
            padding: 20,
            borderRadius: 10,
            width: 400
          }}>

            {/* =========================
                VIEW MODE
            ========================= */}
            {!isEditing ? (
              <>
                <h2>{selectedEvent.title}</h2>

                <p>{selectedEvent.description}</p>
                <p>{selectedEvent.location}</p>
                <p>
                  {selectedEvent.isPublic ? "Public" : "Private"}
                </p>

                {/* OWNER CONTROLS */}
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

                <button type="submit">Save</button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default Calendar;