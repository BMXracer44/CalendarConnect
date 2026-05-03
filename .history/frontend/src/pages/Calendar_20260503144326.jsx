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

  const [errorMessage, setErrorMessage] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editStartDatetime, setEditStartDatetime] = useState("");
  const [editEndDatetime, setEditEndDatetime] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDatetime: "",
    endDatetime: "",
    isPublic: true
  });

  const formatDateTime = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const loadEvents = async () => {
    if (!user?.id) return;

    const res = await fetch(
      `http://localhost:8080/api/events/user/${user.id}`,
      {
        headers: { Authorization: `Bearer ${user.token}` }
      }
    );

    const data = await res.json();

    setEvents(
      data.map((e) => ({
        id: e.id,
        title: e.isPublic ? e.title : `🔒 ${e.title}`,
        start: new Date(e.startDatetime),
        end: new Date(e.endDatetime),
        color: e.isPublic ? "#4f46e5" : "#6b7280",
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

  const createEvent = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:8080/api/events?userId=${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        setErrorMessage(errorData.error || "Event conflict detected");
        return;
      }

      setErrorMessage("");

      setFormData({
        title: "",
        description: "",
        location: "",
        startDatetime: "",
        endDatetime: "",
        isPublic: false
      });

      setShowModal(false);
      loadEvents();
    } catch (err) {
      setErrorMessage("Server error. Please try again.");
    }
  };

  const handleEventClick = (info) => {
    const e = info.event;

    const eventData = {
      id: e.id,
      title: e.title.replace("🔒 ", ""),
      description: e.extendedProps?.description,
      location: e.extendedProps?.location,
      startDatetime: e.startStr,
      endDatetime: e.endStr,
      isPublic: e.extendedProps?.isPublic,
      userId: e.extendedProps?.userId
    };

    setSelectedEvent(eventData);

    setEditTitle(eventData.title || "");
    setEditDescription(eventData.description || "");
    setEditLocation(eventData.location || "");
    setEditStartDatetime(eventData.startDatetime || "");
    setEditEndDatetime(eventData.endDatetime || "");
    setEditIsPublic(eventData.isPublic ?? true);

    setIsEditing(false);
    setShowViewModal(true);
  };

  const updateEvent = async (e) => {
    e.preventDefault();

    try {
      const updated = {
        title: editTitle,
        description: editDescription,
        location: editLocation,
        startDatetime: editStartDatetime,
        endDatetime: editEndDatetime,
        isPublic: editIsPublic
      };

      const res = await fetch(
        `http://localhost:8080/api/events/${selectedEvent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(updated)
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        setErrorMessage(errorData.error || "Update conflict detected");
        return;
      }

      setErrorMessage("");
      setIsEditing(false);
      setShowViewModal(false);
      loadEvents();
    } catch (err) {
      setErrorMessage("Server error. Please try again.");
    }
  };

  const deleteEvent = async () => {
    if (!selectedEvent?.id) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/events/${selectedEvent.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.error || "Delete failed");
        return;
      }

      setShowViewModal(false);
      setSelectedEvent(null);
      loadEvents();
    } catch (err) {
      setErrorMessage("Server error during delete");
    }
  };
const formatForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 16);
};

const handleEventClick = (info) => {
  const e = info.event;

  const eventData = {
    id: e.id,
    title: e.title.replace("🔒 ", ""),
    description: e.extendedProps?.description,
    location: e.extendedProps?.location,

    // 🔥 FIX IS HERE (IMPORTANT)
    startDatetime: formatForInput(e.start),
    endDatetime: formatForInput(e.end),

    isPublic: e.extendedProps?.isPublic,
    userId: e.extendedProps?.userId
  };

  setSelectedEvent(eventData);

  setEditStartDatetime(eventData.startDatetime);
  setEditEndDatetime(eventData.endDatetime);

  setIsEditing(false);
  setShowViewModal(true);
};

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ padding: "20px" }}>
      {errorMessage && (
        <div className="error-popup">
          <div className="error-box">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage("")}>Close</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>My Calendar</h1>
        <button className="addevent" onClick={() => setShowModal(true)}>
          Add Event
        </button>
      </div>

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
                {formData.isPublic ? " Public" : " Private"}
              </label>

              <button type="submit">Create</button>
              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2>{isEditing ? "Edit Event" : "Event Details"}</h2>

              <div className="modal-actions">
                <span
                  onClick={() => setIsEditing(true)}
                  style={{ cursor: "pointer" }}
                >
                  ✏️
                </span>

                <span
                  onClick={deleteEvent}
                  style={{ cursor: "pointer", color: "red" }}
                >
                  🗑️
                </span>

                <span onClick={closeModal} style={{ cursor: "pointer" }}>
                  ✖️
                </span>
              </div>
            </div>

            {!isEditing ? (
              <>
                <p><b>{selectedEvent.title}</b></p>
                <p>{selectedEvent.description}</p>
                <p>{selectedEvent.location}</p>
                <p><b>Start:</b> {formatDateTime(selectedEvent.startDatetime)}</p>
                <p><b>End:</b> {formatDateTime(selectedEvent.endDatetime)}</p>
                <p><b>{selectedEvent.isPublic ? "Public" : "Private"}</b></p>
              </>
            ) : (
              <form onSubmit={updateEvent}>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />

                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />

                <input
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                />

                <input
                  type="datetime-local"
                  value={editStartDatetime}
                  onChange={(e) => setEditStartDatetime(e.target.value)}
                />

                <input
                  type="datetime-local"
                  value={editEndDatetime}
                  onChange={(e) => setEditEndDatetime(e.target.value)}
                />

                <label>
                  <input
                    type="checkbox"
                    checked={editIsPublic}
                    onChange={(e) => setEditIsPublic(e.target.checked)}
                  />
                  {editIsPublic ? " Public" : " Private"}
                </label>

                <button type="submit">Save</button>
                <button type="button" onClick={() => setIsEditing(false)}>
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