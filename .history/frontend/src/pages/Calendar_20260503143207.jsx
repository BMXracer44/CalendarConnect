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

  // FORMAT (DISPLAY ONLY)
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

  // FIX DATE FORMAT FOR BACKEND
  const formatForBackend = (date) =>
    new Date(date).toISOString().slice(0, 16);

  // LOAD EVENTS
  const loadEvents = async () => {
    if (!user?.id) return;

    const res = await fetch(
      `/api/events/user/${user.id}`,
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
          isPublic: e.isPublic
        }
      }))
    );
  };

  useEffect(() => {
    if (user?.id) loadEvents();
  }, [user]);

  // CREATE EVENT
  const createEvent = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      startDatetime: formData.startDatetime?.slice(0, 16),
      endDatetime: formData.endDatetime?.slice(0, 16)
    };

    const res = await fetch(
      `/api/events?userId=${user.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      setErrorMessage(errorData.error || "Error");
      return;
    }

    setShowModal(false);
    loadEvents();
  };

  // CLICK EVENT
  const handleEventClick = (info) => {
    const e = info.event;

    const eventData = {
      id: e.id,
      title: e.title.replace("🔒 ", ""),
      description: e.extendedProps?.description,
      location: e.extendedProps?.location,
      startDatetime: formatForBackend(e.start),
      endDatetime: formatForBackend(e.end),
      isPublic: e.extendedProps?.isPublic
    };

    setSelectedEvent(eventData);

    setEditTitle(eventData.title);
    setEditDescription(eventData.description);
    setEditLocation(eventData.location);
    setEditStartDatetime(eventData.startDatetime);
    setEditEndDatetime(eventData.endDatetime);
    setEditIsPublic(eventData.isPublic);

    setShowViewModal(true);
    setIsEditing(false);
  };

  // UPDATE EVENT
  const updateEvent = async (e) => {
    e.preventDefault();

    const updated = {
      title: editTitle,
      description: editDescription,
      location: editLocation,
      startDatetime: editStartDatetime?.slice(0, 16),
      endDatetime: editEndDatetime?.slice(0, 16),
      isPublic: editIsPublic
    };

    const res = await fetch(
      `/api/events/${selectedEvent.id}`,
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
      setErrorMessage(errorData.error || "Error");
      return;
    }

    setShowViewModal(false);
    loadEvents();
  };

  // DELETE
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

    setShowViewModal(false);
    loadEvents();
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ padding: "20px" }}>

      {errorMessage && (
        <div>
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage("")}>Close</button>
        </div>
      )}

      <button onClick={() => setShowModal(true)}>Add Event</button>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
      />

      {/* CREATE MODAL */}
      {showModal && (
        <div>
          <h2>Create Event</h2>

          <form onSubmit={createEvent}>
            <input placeholder="Title"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <input type="datetime-local"
              onChange={(e) => setFormData({ ...formData, startDatetime: e.target.value })}
            />

            <input type="datetime-local"
              onChange={(e) => setFormData({ ...formData, endDatetime: e.target.value })}
            />

            <label>
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({ ...formData, isPublic: e.target.checked })
                }
              />
              {formData.isPublic ? " Public" : " Private"}
            </label>

            <button type="submit">Create</button>
          </form>
        </div>
      )}

      {/* VIEW / EDIT */}
      {showViewModal && selectedEvent && (
        <div>
          {!isEditing ? (
            <>
              <h3>{selectedEvent.title}</h3>
              <p>{selectedEvent.description}</p>
              <p>{selectedEvent.location}</p>

              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={deleteEvent}>Delete</button>
            </>
          ) : (
            <form onSubmit={updateEvent}>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              <input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />

              <input type="datetime-local"
                value={editStartDatetime}
                onChange={(e) => setEditStartDatetime(e.target.value)}
              />

              <input type="datetime-local"
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
            </form>
          )}
        </div>
      )}

    </div>
  );
}

export default Calendar;