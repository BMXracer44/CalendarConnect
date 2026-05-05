import { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import { AuthContext } from "../context/AuthContext";

// A preset list of aesthetic colors to assign to friends
const PALETTE = ["#e02424", "#d97706", "#059669", "#0284c7", "#7c3aed", "#db2777", "#ea580c", "#14b8a6"];

function Calendar() {
  const { user } = useContext(AuthContext);

  // --- Core States ---
  const [myEvents, setMyEvents] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // --- Social States ---
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]); // Array of checked friend IDs
  const [friendEventsCache, setFriendEventsCache] = useState({}); // Stores fetched events to save bandwidth

  // --- Modal States ---
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // --- Form States ---
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
      year: "numeric", month: "short", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: true
    });
  };

  const formatForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().slice(0, 16);
  };

  // ================= LOAD INITIAL DATA =================
  useEffect(() => {
    if (user?.id) {
      loadMyEvents();
      loadFriends();
    }
  }, [user]);

  const loadMyEvents = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/events/user/${user.id}`);
      const data = await res.json();
      
      setMyEvents(data.map((e) => ({
        id: e.id,
        title: e.isPublic ? e.title : `🔒 ${e.title}`,
        start: new Date(e.startDatetime),
        end: new Date(e.endDatetime),
        color: e.isPublic ? "#4f46e5" : "#6b7280", // Blue for public, Grey for private
        extendedProps: {
          description: e.description,
          location: e.location,
          isPublic: e.isPublic,
          userId: e.userId,
          isFriendEvent: false
        }
      })));
    } catch (err) {
      console.log("Failed to load personal events");
    }
  };

  const loadFriends = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/friends/${user.id}`);
      const data = await res.json();
      
      // Assign a consistent color to each friend based on their index in the list
      const friendsWithColors = data.map((friend, index) => ({
        ...friend,
        color: PALETTE[index % PALETTE.length]
      }));
      
      setFriends(friendsWithColors);
    } catch (err) {
      console.log("Failed to load friends");
    }
  };

  // ================= FRIEND TOGGLE LOGIC =================
  useEffect(() => {
    // Whenever the selectedFriends array changes, check if we need to fetch their events
    selectedFriends.forEach(friendId => {
      if (!friendEventsCache[friendId]) {
        fetchFriendEvents(friendId);
      }
    });
  }, [selectedFriends]);

  const fetchFriendEvents = async (friendId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/events/user/${friendId}/public`);
      const data = await res.json();
      
      // Find the color we assigned to this friend
      const friendColor = friends.find(f => f.id === friendId)?.color || "#000";

      const formattedEvents = data.map(e => ({
        id: `friend-${e.id}`, // Prevent ID collisions with personal events
        title: `${e.title}`,
        start: new Date(e.startDatetime),
        end: new Date(e.endDatetime),
        color: friendColor, 
        extendedProps: {
          description: e.description,
          location: e.location,
          isPublic: true,
          userId: e.userId,
          isFriendEvent: true // Flag to prevent editing friend events!
        }
      }));

      // Save to cache so we don't fetch again if toggled off and on
      setFriendEventsCache(prev => ({ ...prev, [friendId]: formattedEvents }));
    } catch (err) {
      console.log(`Failed to load events for friend ${friendId}`);
    }
  };

  const handleToggleFriend = (friendId) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId) // Remove if already checked
        : [...prev, friendId]                // Add if not checked
    );
  };

  const handleToggleAll = () => {
    if (selectedFriends.length === friends.length) {
      setSelectedFriends([]); // Deselect all
    } else {
      setSelectedFriends(friends.map(f => f.id)); // Select all
    }
  };

  // Compile the final list of events to show on the calendar
  const visibleFriendEvents = selectedFriends.flatMap(id => friendEventsCache[id] || []);
  const allDisplayEvents = [...myEvents, ...visibleFriendEvents];

  // ================= CRUD OPERATIONS =================
  const createEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/events?userId=${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errorData = await res.json();
        setErrorMessage(errorData.error || "Event conflict detected");
        return;
      }
      setErrorMessage("");
      setFormData({ title: "", description: "", location: "", startDatetime: "", endDatetime: "", isPublic: false });
      setShowModal(false);
      loadMyEvents();
    } catch (err) {
      setErrorMessage("Server error. Please try again.");
    }
  };

  const handleEventClick = (info) => {
    const e = info.event;
    const isFriendEvent = e.extendedProps?.isFriendEvent;

    const eventData = {
      id: e.id.toString().replace('friend-', ''), // clean ID if needed
      title: e.title.replace("🔒 ", ""),
      description: e.extendedProps?.description,
      location: e.extendedProps?.location,
      startDatetime: formatForInput(e.start),
      endDatetime: formatForInput(e.end),
      isPublic: e.extendedProps?.isPublic,
      userId: e.extendedProps?.userId,
      isFriendEvent: isFriendEvent
    };

    setSelectedEvent(eventData);
    setEditTitle(eventData.title || "");
    setEditDescription(eventData.description || "");
    setEditLocation(eventData.location || "");
    setEditStartDatetime(eventData.startDatetime);
    setEditEndDatetime(eventData.endDatetime);
    setEditIsPublic(eventData.isPublic ?? true);
    
    setIsEditing(false);
    setShowViewModal(true);
  };

  const updateEvent = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        title: editTitle, description: editDescription, location: editLocation,
        startDatetime: editStartDatetime, endDatetime: editEndDatetime, isPublic: editIsPublic
      };
      const res = await fetch(`http://localhost:8080/api/events/${selectedEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (!res.ok) {
        const errorData = await res.json();
        setErrorMessage(errorData.error || "Update conflict detected");
        return;
      }
      setErrorMessage("");
      setIsEditing(false);
      setShowViewModal(false);
      loadMyEvents();
    } catch (err) {
      setErrorMessage("Server error. Please try again.");
    }
  };

  const deleteEvent = async () => {
    if (!selectedEvent?.id) return;
    try {
      const res = await fetch(`http://localhost:8080/api/events/${selectedEvent.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.error || "Delete failed");
        return;
      }
      setShowViewModal(false);
      setSelectedEvent(null);
      loadMyEvents();
    } catch (err) {
      setErrorMessage("Server error during delete");
    }
  };
  const closeModal = () => {
    setShowViewModal(false);
    setIsEditing(false);
    setSelectedEvent(null);
  };
  // Authentication check
  if (!user) return <p>Please log in</p>;

  return (
    <div className="calendar-page">
      {errorMessage && (
        <div className="error-popup">
          <div className="error-box">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage("")}>Close</button>
          </div>
        </div>
      )}

      {/* --- CALENDAR WRAPPER (controls + calendar in one centered block) --- */}
      <div className="calendar-outer">

        {/* --- CONTROLS ROW --- */}
        <div className="calendar-controls">
          <button className="addevent" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? "Hide Friends" : "Show Friends"}
          </button>
          <h1 className="calendar-title">My Calendar</h1>
          <button className="addevent" onClick={() => setShowModal(true)}>
            + Add Event
          </button>
        </div>

        {/* --- CALENDAR + OVERLAY SIDEBAR --- */}
        <div className="calendar-layout">

          {/* SIDEBAR overlays the calendar — does not push it */}
          <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
            <div className="sidebar-content">
              <div className="sidebar-header">
                <h3>Friends</h3>
                <button className="select-all-btn" onClick={handleToggleAll}>
                  {selectedFriends.length === friends.length && friends.length > 0 ? "Deselect All" : "Select All"}
                </button>
              </div>

              {friends.length === 0 ? (
                <p style={{ color: "#777", fontSize: "14px" }}>No friends added yet.</p>
              ) : (
                friends.map(friend => (
                  <div key={friend.id} className="friend-toggle">
                    <div className="friend-info">
                      <div className="color-dot" style={{ backgroundColor: friend.color }}></div>
                      <span>{friend.username}</span>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={selectedFriends.includes(friend.id)}
                        onChange={() => handleToggleFriend(friend.id)}
                      />
                      <span className="toggle-slider" style={{ "--toggle-color": friend.color }}></span>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* MAIN CALENDAR — always full width */}
          <div className="calendar-main">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
              initialView="dayGridMonth"
              events={allDisplayEvents}
              eventClick={handleEventClick}
              height="700px"
            />
          </div>

        </div>
      </div>{/* end calendar-outer */}

      {/* --- ADD EVENT MODAL (Unchanged) --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Create Event</h2>
            <form onSubmit={createEvent}>
              <input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              <input placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <input placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              <input type="datetime-local" value={formData.startDatetime} onChange={(e) => setFormData({ ...formData, startDatetime: e.target.value })} />
              <input type="datetime-local" value={formData.endDatetime} onChange={(e) => setFormData({ ...formData, endDatetime: e.target.value })} />
              <label>
                <input type="checkbox" checked={formData.isPublic} onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })} />
                {formData.isPublic ? " Public" : " Private"}
              </label>
              <button type="submit">Create</button>
              <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW / EDIT MODAL --- */}
      {showViewModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              {/* Show different title if it's a friend's event */}
              <h2>{selectedEvent.isFriendEvent ? "Friend's Event" : (isEditing ? "Edit Event" : "Event Details")}</h2>

              <div className="modal-actions">
                {/* Hide Edit/Delete icons if looking at a friend's event */}
                {!selectedEvent.isFriendEvent && (
                  <>
                    <span onClick={() => setIsEditing(true)} style={{ cursor: "pointer" }}>✏️</span>
                    <span onClick={deleteEvent} style={{ cursor: "pointer", color: "red" }}>🗑️</span>
                  </>
                )}
                <span onClick={closeModal} style={{ cursor: "pointer" }}>✖️</span>
              </div>
            </div>

            {!isEditing ? (
              <>
                <p><b>{selectedEvent.title}</b></p>
                <p>{selectedEvent.description}</p>
                <p>{selectedEvent.location}</p>
                <p><b>Start:</b> {formatDateTime(selectedEvent.startDatetime)}</p>
                <p><b>End:</b> {formatDateTime(selectedEvent.endDatetime)}</p>
                {/* Don't show public/private status if looking at a friend's event, since it's obviously public */}
                {!selectedEvent.isFriendEvent && <p><b>{selectedEvent.isPublic ? "Public" : "Private"}</b></p>}
              </>
            ) : (
              <form onSubmit={updateEvent}>
                {/* ... Edit form inputs unchanged ... */}
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                <input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
                <input type="datetime-local" value={editStartDatetime} onChange={(e) => setEditStartDatetime(e.target.value)} />
                <input type="datetime-local" value={editEndDatetime} onChange={(e) => setEditEndDatetime(e.target.value)} />
                <label>
                  <input type="checkbox" checked={editIsPublic} onChange={(e) => setEditIsPublic(e.target.checked)} />
                  {editIsPublic ? " Public" : " Private"}
                </label>
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