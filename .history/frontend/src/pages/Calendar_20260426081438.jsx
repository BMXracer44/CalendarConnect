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

  // EDIT STATE
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editStartDatetime, setEditStartDatetime] = useState("");
  const [editEndDatetime, setEditEndDatetime] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDatetime: "",
    endDatetime: "",
    isPublic: true
  });

  // ================= LOAD EVENTS =================
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
      data.map(e => ({
        id: e.id,
        title: e.isPublic ? e.title : `🔒 ${e.title}`,
        start: e.startDatetime,
        end: e.endDatetime,
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

  // ================= CREATE EVENT =================
  const createEvent = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:8080/api/events?userId=${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(formData)
    });

    setShowModal(false);
    loadEvents();
  };

  // ================= EVENT CLICK =================
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

    setIsEditing(false);
    setShowViewModal(true);
  };

  // ================= UPDATE EVENT =================
  const updateEvent = async (e) => {
    e.preventDefault();

    const updated = {
      title: editTitle,
      description: editDescription,
      location: editLocation,
      startDatetime: editStartDatetime,
      endDatetime: editEndDatetime
    };

    await fetch(`http://localhost:8080/api/events/${selectedEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify(updated)
    });

    setIsEditing(false);
    setShowViewModal(false);
    loadEvents();
  };

  const closeModal = () => {
    setShowViewModal(false);
    setIsEditing(false);
    setSelectedEvent(null);
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ padding: "20px" }}>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>My Calendar</h1>
        <button onClick={() => setShowModal(true)}>+ Add Event</button>
      </div>

      {/* CALENDAR */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
      />

      {/* ================= VIEW / EDIT MODAL ================= */}
      {showViewModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-box">

            {/* HEADER */}
            <div className="modal-header">
              <h2>{isEditing ? "Edit Event" : "Event Details"}</h2>

              <div className="modal-actions">

                {/* EDIT ICON */}
                {String(selectedEvent?.userId) === String(user?.id) && !isEditing && (
                  <span
                    style={{ cursor: "pointer", fontSize: "22px", marginRight: "10px" }}
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️
                  </span>
                )}

                {/* CLOSE ICON */}
                <span
                  style={{ cursor: "pointer", fontSize: "22px" }}
                  onClick={closeModal}
                >
                  ✖️
                </span>

              </div>
            </div>

            {/* VIEW MODE */}
            {!isEditing ? (
              <>
                <p><b>{selectedEvent.title}</b></p>
                <p>{selectedEvent.description}</p>
                <p>{selectedEvent.location}</p>
                <p>{selectedEvent.startDatetime}</p>
                <p>{selectedEvent.endDatetime}</p>
              </>
            ) : (
              /* EDIT MODE */
              <form onSubmit={updateEvent}>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                <input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />

                <input type="datetime-local" value={editStartDatetime} onChange={(e) => setEditStartDatetime(e.target.value)} />
                <input type="datetime-local" value={editEndDatetime} onChange={(e) => setEditEndDatetime(e.target.value)} />

                <button type="submit">Save</button>
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default Calendar;