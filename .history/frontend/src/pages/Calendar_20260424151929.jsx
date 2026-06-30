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

          // full details stored here
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
          body: JSON.stringify({
            ...formData,
            isPublic: formData.isPublic
          })
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
  // EVENT CLICK (VIEW DETAILS)
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
        alert("Delete failed");
        return;
      }

      setShowViewModal(false);
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

      if (!res.ok) {
        alert("Update failed");
        return;
      }

      setIsEditing(false);
      setShowViewModal(false);
      loadEvents();
    } catch (err) {
      console.error(err);
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
          CREATE EVENT MODAL
      ========================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Create Event</h2>

            <form onSubmit={createEvent}>
              <input
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              <input
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <input
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />

              <input
                type="datetime-local"
                value={formData.startDatetime}
                onChange={(e) =>
                  setFormData({ ...formData, startDatetime: e.target.value })
                }
              />

              <input
                type="datetime-local"
                value={formData.endDatetime}
                onChange={(e) =>
                  setFormData({ ...formData, endDatetime: e.target.value })
                }
              />

              <label>
                Public:
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isPublic: e.target.checked
                    })
                  }
                />
              </label>

              <button type="submit">Create</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          VIEW / EDIT MODAL
      ========================= */}
      {showViewModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h2>{isEditing ? "Edit Event" : "Event Details"}</h2>

            {isEditing ? (
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
            ) : (
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
            )}

            {/* OWNER ONLY ACTIONS */}
            {selectedEvent.userId === user.id && (
              <>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)}>
                    Edit
                  </button>
                )}
                <button onClick={deleteEvent}>Delete</button>
              </>
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