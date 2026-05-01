import { useState, useEffect, useContext } from "react";
import Switch from "react-switch";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import { AuthContext } from "../context/AuthContext";

function Calendar() {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);

  // ================= FRIEND STATES =================
  const [privacyMode, setPrivacyMode] = useState(false);

  const [friends, setFriends] = useState([
    {
      id: 1,
      name: "Alex",
      color: "#10b981",
      visible: true
    },
    {
      id: 2,
      name: "Jordan",
      color: "#f59e0b",
      visible: true
    }
  ]);

  // Temporary frontend-only mock friend events
  const [friendEvents] = useState([
    {
      id: "friend-1",
      friendId: 1,
      title: "Study Group",
      start: "2026-05-02T13:00:00",
      end: "2026-05-02T15:00:00",
      color: "#10b981"
    },
    {
      id: "friend-2",
      friendId: 2,
      title: "Gym",
      start: "2026-05-04T18:00:00",
      end: "2026-05-04T19:00:00",
      color: "#f59e0b"
    }
  ]);

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
        setErrorMessage(
          errorData.message || "Event conflict detected"
        );
        return;
      }

      setErrorMessage("");

      setFormData({
        title: "",
        description: "",
        location: "",
        startDatetime: "",
        endDatetime: "",
        isPublic: true
      });

      setShowModal(false);
      loadEvents();
    } catch (err) {
      setErrorMessage("Server error. Please try again.");
    }
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

    try {
      const updated = {
        title: editTitle,
        description: editDescription,
        location: editLocation,
        startDatetime: editStartDatetime,
        endDatetime: editEndDatetime
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
        setErrorMessage(
          errorData.message || "Update conflict detected"
        );
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

  // ================= CLOSE MODAL =================
  const closeModal = () => {
    setShowViewModal(false);
    setIsEditing(false);
    setSelectedEvent(null);
  };

  // ================= TOGGLE FRIEND VISIBILITY =================
  const toggleFriendVisibility = (friendId) => {
    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === friendId
          ? { ...friend, visible: !friend.visible }
          : friend
      )
    );
  };

  // ================= FILTER FRIEND EVENTS =================
  const visibleFriendEvents = friendEvents.filter((event) => {
    const friend = friends.find(
      (f) => f.id === event.friendId
    );
    return friend?.visible;
  });

  // ================= COMBINED CALENDAR EVENTS =================
  const calendarEvents = [
    ...events,
    ...(!privacyMode ? visibleFriendEvents : [])
  ];

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* ERROR POPUP */}
      {errorMessage && (
        <div className="error-popup">
          <div className="error-box">
            <p>{errorMessage}</p>
            <button
              onClick={() => setErrorMessage("")}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <h1>My Calendar</h1>

        <button
          className="addevent"
          onClick={() => setShowModal(true)}
        >
          Add Event
        </button>
      </div>

      {/* CALENDAR + SIDEBAR */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "flex-start"
        }}
      >
        {/* MAIN CALENDAR */}
        <div style={{ flex: 1 }}>
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              bootstrap5Plugin
            ]}
            initialView="dayGridMonth"
            events={calendarEvents}
            eventClick={handleEventClick}
          />
        </div>

        {/* RIGHT SIDEBAR */}
        <div
          style={{
            width: "200px",
            background: "#ffffff",
            borderRadius: "10px",
            padding: "12px",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.08)"
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>
            Friends
          </h3>

          {/* Privacy Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px"
            }}
          >
            <span>Privacy Mode</span>

            <Switch
              checked={privacyMode}
              onChange={() =>
                setPrivacyMode(!privacyMode)
              }
              height={18}
              width={38}
              uncheckedIcon={false}
              checkedIcon={false}
            />
          </div>

          <hr />

          {/* Friend Toggle List */}
          {friends.map((friend) => (
            <div
              key={friend.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "12px"
              }}
            >
              {/* Left side: color + name */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: friend.color
                  }}
                />

                <span>{friend.name}</span>
              </div>

              {/* Switch Toggle */}
              <Switch
                checked={friend.visible}
                onChange={() =>
                  toggleFriendVisibility(friend.id)
                }
                height={16}
                width={34}
                uncheckedIcon={false}
                checkedIcon={false}
                onColor={friend.color}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================= ADD EVENT MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Create Event</h2>

            <form onSubmit={createEvent}>
              <input
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value
                  })
                }
              />

              <input
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value
                  })
                }
              />

              <input
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value
                  })
                }
              />

              <input
                type="datetime-local"
                value={formData.startDatetime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDatetime: e.target.value
                  })
                }
              />

              <input
                type="datetime-local"
                value={formData.endDatetime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endDatetime: e.target.value
                  })
                }
              />

              <button type="submit">
                Create
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW / EDIT MODAL ================= */}
      {showViewModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h2>
                {isEditing
                  ? "Edit Event"
                  : "Event Details"}
              </h2>

              <div className="modal-actions">
                <span
                  onClick={() =>
                    setIsEditing(true)
                  }
                  style={{ cursor: "pointer" }}
                >
                  ✏️
                </span>

                <span
                  onClick={closeModal}
                  style={{ cursor: "pointer" }}
                >
                  ✖️
                </span>
              </div>
            </div>

            {!isEditing ? (
              <>
                <p>
                  <b>{selectedEvent.title}</b>
                </p>
                <p>{selectedEvent.description}</p>
                <p>{selectedEvent.location}</p>
                <p>{selectedEvent.startDatetime}</p>
                <p>{selectedEvent.endDatetime}</p>
              </>
            ) : (
              <form onSubmit={updateEvent}>
                <input
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                />

                <input
                  value={editDescription}
                  onChange={(e) =>
                    setEditDescription(
                      e.target.value
                    )
                  }
                />

                <input
                  value={editLocation}
                  onChange={(e) =>
                    setEditLocation(
                      e.target.value
                    )
                  }
                />

                <input
                  type="datetime-local"
                  value={editStartDatetime}
                  onChange={(e) =>
                    setEditStartDatetime(
                      e.target.value
                    )
                  }
                />

                <input
                  type="datetime-local"
                  value={editEndDatetime}
                  onChange={(e) =>
                    setEditEndDatetime(
                      e.target.value
                    )
                  }
                />

                <button type="submit">
                  Save
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setIsEditing(false)
                  }
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