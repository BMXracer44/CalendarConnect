import { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import { AuthContext } from "../context/AuthContext";

const PALETTE = ["#e02424", "#d97706", "#059669", "#0284c7", "#7c3aed", "#db2777", "#ea580c", "#14b8a6"];

function Calendar() {
  const { user } = useContext(AuthContext);

  // --- Core States ---
  const [myEvents, setMyEvents] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false); 
  
  // --- Social States ---
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]); 
  const [friendEventsCache, setFriendEventsCache] = useState({}); 

  // --- Invite & Notification States ---
  const [inviteModalEvent, setInviteModalEvent] = useState(null);
  const [friendsToInvite, setFriendsToInvite] = useState([]);
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [eventInvites, setEventInvites] = useState([]);
  const [eventAttendees, setEventAttendees] = useState([]); 

  // --- Modal & Form States ---
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "", description: "", location: "", startDatetime: "", endDatetime: "", isPublic: true
  });

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editStartDatetime, setEditStartDatetime] = useState("");
  const [editEndDatetime, setEditEndDatetime] = useState("");
  const [editIsPublic, setEditIsPublic] = useState(true);

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true
    });
  };

  const formatForInput = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().slice(0, 16);
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    if (user?.id) {
      loadMyEvents();
      loadFriends();
      loadNotifications();
    }
  }, [user]);

  const loadMyEvents = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/events/user/${user.id}`);
      const myData = await res.json();

      let accData = [];
      try {
        const accRes = await fetch(`http://localhost:8080/api/events/accepted/${user.id}`);
        if (accRes.ok) accData = await accRes.json();
      } catch (e) {}

      const allData = [...myData, ...accData];
      const uniqueData = Array.from(new Map(allData.map(e => [e.id, e])).values());

      setMyEvents(uniqueData.map((e) => ({
        id: e.id,
        title: e.isPublic ? e.title : `🔒 ${e.title}`,
        start: new Date(e.startDatetime),
        end: new Date(e.endDatetime),
        color: e.userId === user.id ? (e.isPublic ? "#4f46e5" : "#6b7280") : "#10b981",
        extendedProps: { ...e, isFriendEvent: false, isAcceptedInvite: e.userId !== user.id }
      })));
    } catch (err) { console.log("Failed to load personal events"); }
  };

  const loadFriends = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/friends/${user.id}`);
      const data = await res.json();
      
      setFriends(data.map((friend, index) => ({ 
        ...friend, 
        id: friend.requesterId, 
        color: PALETTE[index % PALETTE.length] 
      })));
    } catch (err) { console.log("Failed to load friends"); }
  };

  // ================= NOTIFICATION LOGIC =================
  const loadNotifications = async () => {
    try {
      const frRes = await fetch(`http://localhost:8080/api/friends/requests/${user.id}`);
      const frData = await frRes.json();
      setFriendRequests(frData || []);
    } catch (err) { }

    try {
      const invRes = await fetch(`http://localhost:8080/api/events/invites/${user.id}`);
      if (invRes.ok) {
        const invData = await invRes.json();
        const populatedInvites = await Promise.all(invData.map(async (invite) => {
          try {
            const eventRes = await fetch(`http://localhost:8080/api/events/${invite.eventId}`);
            if (eventRes.ok) {
              const eventData = await eventRes.json();
              return { ...invite, eventTitle: eventData.title };
            }
            return { ...invite, eventTitle: "Event Invitation" };
          } catch(e) { return { ...invite, eventTitle: "Event Invitation" }; }
        }));
        setEventInvites(populatedInvites);
      }
    } catch (err) { }
  };

  const respondToEvent = async (eventId, status) => {
    try {
      await fetch(`http://localhost:8080/api/events/${eventId}/respond/${user.id}?status=${status}`, { method: "PUT" });
      setEventInvites(prev => prev.filter(inv => inv.eventId !== eventId));
      if (status === "going") {
        loadMyEvents(); 
      }
    } catch (err) { setErrorMessage("Failed to respond to invite."); }
  };

  const acceptFriend = async (fromId) => {
    try {
      await fetch(`http://localhost:8080/api/friends/accept?from=${fromId}&to=${user.id}`, { method: "POST" });
      setFriendRequests(prev => prev.filter(req => req.requesterId !== fromId));
      loadFriends(); 
    } catch (err) { setErrorMessage("Failed to accept friend request."); }
  };

  // ================= EVENT INVITE LOGIC =================
  const upcomingEvents = myEvents
    .filter(e => !e.extendedProps.isFriendEvent && !e.extendedProps.isAcceptedInvite && e.start >= new Date())
    .sort((a, b) => a.start - b.start);

  const handleToggleInviteCheckbox = (friendId) => {
    setFriendsToInvite(prev => prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]);
  };

  const sendInvites = async () => {
    try {
      for (let friendId of friendsToInvite) {
        const res = await fetch(`http://localhost:8080/api/events/${inviteModalEvent.id}/invite/${friendId}`, { method: "POST" });
        if (!res.ok) throw new Error("Backend error");
      }
      alert("Invitations sent successfully!");
      setInviteModalEvent(null);
      setFriendsToInvite([]);
    } catch (err) {
      setErrorMessage("Failed to send invites. Check backend console.");
    }
  };

  // ================= FRIEND TOGGLE LOGIC =================
  useEffect(() => {
    selectedFriends.forEach(friendId => {
      if (!friendEventsCache[friendId]) fetchFriendEvents(friendId);
    });
  }, [selectedFriends]);

  const fetchFriendEvents = async (friendId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/events/user/${friendId}/public`);
      const data = await res.json();
      const friendColor = friends.find(f => f.id === friendId)?.color || "#000";
      const formatted = data.map(e => ({
        id: `friend-${e.id}`, title: e.title, start: new Date(e.startDatetime), end: new Date(e.endDatetime),
        color: friendColor, extendedProps: { ...e, isFriendEvent: true }
      }));
      setFriendEventsCache(prev => ({ ...prev, [friendId]: formatted }));
    } catch (err) {}
  };

  const handleToggleFriend = (friendId) => {
    setSelectedFriends(prev => prev.includes(friendId) ? prev.filter(id => id !== friendId) : [...prev, friendId]);
  };

  const handleToggleAll = () => {
    if (selectedFriends.length === friends.length) setSelectedFriends([]);
    else setSelectedFriends(friends.map(f => f.id)); 
  };

  const visibleFriendEvents = selectedFriends.flatMap(id => friendEventsCache[id] || []);
  const allDisplayEvents = [...myEvents, ...visibleFriendEvents];

  // ================= CRUD OPERATIONS =================
  const createEvent = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.startDatetime || !formData.endDatetime) {
        setErrorMessage("Please fill out the title, start time, and end time."); return;
    }
    const safePayload = { ...formData, startDatetime: formData.startDatetime.substring(0, 16), endDatetime: formData.endDatetime.substring(0, 16) };
    try {
      const res = await fetch(`http://localhost:8080/api/events?userId=${user.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(safePayload) });
      if (!res.ok) { const errorData = await res.json(); setErrorMessage(errorData.error || "Event conflict detected"); return; }
      setErrorMessage(""); setFormData({ title: "", description: "", location: "", startDatetime: "", endDatetime: "", isPublic: true });
      setShowModal(false); loadMyEvents();
    } catch (err) { setErrorMessage("Server error. Please try again."); }
  };

  const updateEvent = async (e) => {
    e.preventDefault();
    if (!editTitle || !editStartDatetime || !editEndDatetime) { setErrorMessage("Title and dates cannot be empty!"); return; }
    const safeUpdatePayload = { title: editTitle, description: editDescription, location: editLocation, startDatetime: editStartDatetime.substring(0, 16), endDatetime: editEndDatetime.substring(0, 16), isPublic: editIsPublic };
    try {
      const res = await fetch(`http://localhost:8080/api/events/${selectedEvent.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(safeUpdatePayload) });
      if (!res.ok) { const errorData = await res.json(); setErrorMessage(errorData.error || "Update conflict detected"); return; }
      setErrorMessage(""); setIsEditing(false); setShowViewModal(false); loadMyEvents();
    } catch (err) { setErrorMessage("Server error. Please try again."); }
  };

  const handleEventClick = async (info) => {
    const e = info.event;
    const isFriendEvent = e.extendedProps?.isFriendEvent;
    const isAcceptedInvite = e.extendedProps?.isAcceptedInvite;
    const eventUserId = e.extendedProps?.userId;
    
    // NEW: Determine the Host Name dynamically!
    let hostName = "Unknown";
    if (eventUserId === user.id) {
        hostName = "You";
    } else {
        const friendHost = friends.find(f => f.id === eventUserId);
        hostName = friendHost ? friendHost.username : "A Friend";
    }

    const eventData = {
      id: e.id.toString().replace('friend-', ''),
      title: e.title.replace("🔒 ", ""),
      description: e.extendedProps?.description, location: e.extendedProps?.location,
      startDatetime: formatForInput(e.start), endDatetime: formatForInput(e.end),
      isPublic: e.extendedProps?.isPublic, userId: eventUserId, 
      isFriendEvent: isFriendEvent, isAcceptedInvite: isAcceptedInvite,
      hostName: hostName // <-- Added to event state
    };

    setSelectedEvent(eventData);
    setEditTitle(eventData.title || ""); setEditDescription(eventData.description || ""); setEditLocation(eventData.location || "");
    setEditStartDatetime(eventData.startDatetime); setEditEndDatetime(eventData.endDatetime); setEditIsPublic(eventData.isPublic ?? true);
    setIsEditing(false); setShowViewModal(true);
    setEventAttendees([]); 

    try {
      const attRes = await fetch(`http://localhost:8080/api/events/${eventData.id}/attendees`);
      if (attRes.ok) {
        const names = await attRes.json();
        setEventAttendees(names);
      }
    } catch (err) { }
  };

  const deleteEvent = async () => {
    if (!selectedEvent?.id) return;
    try {
      const res = await fetch(`http://localhost:8080/api/events/${selectedEvent.id}`, { method: "DELETE" });
      if (!res.ok) { const data = await res.json(); setErrorMessage(data.error || "Delete failed"); return; }
      setShowViewModal(false); setSelectedEvent(null); loadMyEvents();
    } catch (err) { setErrorMessage("Server error during delete"); }
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div className="calendar-page">
      {errorMessage && (
        <div className="error-popup" style={{ zIndex: 999999 }}>
          <div className="error-box">
             <p>{errorMessage}</p>
             <button onClick={() => setErrorMessage("")}>Close</button>
          </div>
        </div>
      )}

      <div className="calendar-outer">
        {/* --- CONTROLS ROW --- */}
        <div className="calendar-controls" style={{ width: "100%", maxWidth: "1400px", display: "flex", justifyContent: "space-between", marginBottom: "20px", position: "relative", zIndex: 100 }}>
          <button className="addevent" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? "Hide Friends" : "Show Friends"}
          </button>
          
          <h1 className="calendar-title" style={{ margin: 0, color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>My Calendar</h1>
          
          {/* TOP RIGHT ACTION CLUSTER */}
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>

            <div className="nav-bell" style={{ position: "relative", zIndex: 10000 }}>
              <button onClick={() => setShowBellDropdown(!showBellDropdown)} style={{ padding: "12px 18px", border: "none", borderRadius: "12px", background: "#f1f3f8", color: "#333", fontWeight: "700", cursor: "pointer", position: "relative" }}>
                🔔 Notifications
                {(friendRequests.length + eventInvites.length) > 0 && (
                   <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "#ef4444", color: "white", fontSize: "11px", fontWeight: "bold", width: "20px", height: "20px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "50%" }}>
                     {friendRequests.length + eventInvites.length}
                   </span>
                )}
              </button>
              
              {showBellDropdown && (
                <div style={{ position: "absolute", right: 0, top: "50px", width: "280px", background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", zIndex: 99999 }}>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", color: "#667eea", borderBottom: "1px solid #eee", paddingBottom: "8px", textAlign: "left" }}>Friend Requests</h4>
                  {friendRequests.length === 0 ? <p style={{ fontSize: "13px", color: "#777", textAlign: "left" }}>No new requests.</p> : (
                    friendRequests.map(req => (
                      <div key={`fr-${req.id}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "#f4f6fb", borderRadius: "10px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "14px", color: "#333", fontWeight: "500" }}>{req.username}</span>
                        <button onClick={() => acceptFriend(req.requesterId)} style={{ padding: "6px 10px", border: "none", borderRadius: "8px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", fontSize: "12px", cursor: "pointer" }}>Accept</button>
                      </div>
                    ))
                  )}

                  <h4 style={{ margin: "15px 0 12px 0", fontSize: "15px", color: "#667eea", borderBottom: "1px solid #eee", paddingBottom: "8px", textAlign: "left" }}>Event Invites</h4>
                  {eventInvites.length === 0 ? <p style={{ fontSize: "13px", color: "#777", textAlign: "left" }}>No new invites.</p> : (
                    eventInvites.map(inv => (
                      <div key={`inv-${inv.eventId}`} style={{ display: "flex", flexDirection: "column", padding: "10px", background: "#f4f6fb", borderRadius: "10px", marginBottom: "8px" }}>
                        <span style={{ fontWeight: "600", fontSize: "14px", marginBottom: "8px", color: "#333", textAlign: "left" }}>{inv.eventTitle}</span>
                        <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                          <button onClick={() => respondToEvent(inv.eventId, "going")} style={{ flex: 1, padding: "6px", border: "none", borderRadius: "8px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", fontSize: "12px", cursor: "pointer" }}>Going</button>
                          <button onClick={() => respondToEvent(inv.eventId, "declined")} style={{ flex: 1, padding: "6px", border: "none", borderRadius: "8px", background: "#e5e7eb", color: "#555", fontSize: "12px", cursor: "pointer" }}>Decline</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <button className="addevent" style={{ position: "relative", zIndex: 9999 }} onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}>
              {isRightSidebarOpen ? "Close Invites" : "Invite Friends"}
            </button>
            <button className="addevent" style={{ position: "relative", zIndex: 9999 }} onClick={() => setShowModal(true)}>
              + Add Event
            </button>
          </div>
        </div>

        {/* --- CALENDAR + BOTH OVERLAY SIDEBARS --- */}
        <div className="calendar-layout" style={{ maxWidth: "1400px", margin: "0 auto", position: "relative" }}>

          {/* LEFT SIDEBAR (View Friends Calendars) */}
          <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
            <div className="sidebar-content">
              <div className="sidebar-header">
                <h3>View Friends</h3>
              </div>
              {friends.length === 0 ? <p style={{ color: "#777", fontSize: "14px" }}>No friends added yet.</p> : (
                friends.map(friend => (
                  <div key={friend.id} className="friend-toggle">
                    <div className="friend-info">
                      <div className="color-dot" style={{ backgroundColor: friend.color }}></div>
                      <span>{friend.username}</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={selectedFriends.includes(friend.id)} onChange={() => handleToggleFriend(friend.id)} />
                      <span className="toggle-slider" style={{ "--toggle-color": friend.color }}></span>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR (Send Invites) */}
          <div className={`right-sidebar ${isRightSidebarOpen ? "open" : "closed"}`}>
            <div className="right-sidebar-content">
              <div className="sidebar-header">
                <h3>Upcoming Events</h3>
              </div>
              {upcomingEvents.length === 0 ? <p style={{ color: "#777", fontSize: "14px" }}>No upcoming events to invite friends to.</p> : (
                upcomingEvents.map(event => (
                  <div key={event.id} className="upcoming-event-card">
                    <h4>{event.title}</h4>
                    <p>{formatDateTime(event.start)}</p>
                    <button className="invite-action-btn" onClick={() => {
                        setInviteModalEvent(event);
                        setFriendsToInvite([]); // Reset checkboxes
                    }}>
                       + Invite Friends
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* MAIN CALENDAR */}
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
      </div>

      {/* --- ADD EVENT MODAL --- */}
      {showModal && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="modal-box" style={{ background: "white", padding: "40px", borderRadius: "18px", width: "420px", position: "relative", zIndex: 100000 }}>
            <h2 style={{ marginTop: 0 }}>Create Event</h2>
            <form onSubmit={createEvent}>
              <input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
              <input placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
              <input placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
              <input type="datetime-local" value={formData.startDatetime} onChange={(e) => setFormData({ ...formData, startDatetime: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
              <input type="datetime-local" value={formData.endDatetime} onChange={(e) => setFormData({ ...formData, endDatetime: e.target.value })} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
              <label style={{ display: "block", marginBottom: "15px" }}>
                <input type="checkbox" checked={formData.isPublic} onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })} style={{ marginRight: "8px" }} />
                {formData.isPublic ? " Public Event" : " Private Event"}
              </label>
              <button type="submit" style={{ width: "100%", padding: "12px", background: "#667eea", color: "white", border: "none", borderRadius: "10px", marginBottom: "10px", cursor: "pointer" }}>Create</button>
              <button type="button" onClick={() => setShowModal(false)} style={{ width: "100%", padding: "12px", background: "#f1f3f8", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", color: "#333" }}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW / EDIT MODAL --- */}
      {showViewModal && selectedEvent && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="modal-box" style={{ background: "white", padding: "40px", borderRadius: "18px", width: "420px", position: "relative", zIndex: 100000 }}>
            <div className="modal-header">
              <h2 style={{ marginTop: 0 }}>{selectedEvent.isFriendEvent ? "Friend's Event" : (isEditing ? "Edit Event" : "Event Details")}</h2>
              <div className="modal-actions">
                {!selectedEvent.isFriendEvent && !selectedEvent.isAcceptedInvite && (
                  <>
                    <span onClick={() => setIsEditing(true)} style={{ cursor: "pointer" }}>✏️</span>
                    <span onClick={deleteEvent} style={{ cursor: "pointer", color: "red" }}>🗑️</span>
                  </>
                )}
                <span onClick={() => { setShowViewModal(false); setIsEditing(false); setEventAttendees([]); }} style={{ cursor: "pointer" }}>✖️</span>
              </div>
            </div>

            {!isEditing ? (
              <>
                <p><b>{selectedEvent.title}</b></p>
                {/* NEW: Displaying the Host Name */}
                <p><b>Host:</b> <span style={{ color: "#4f46e5", fontWeight: "600" }}>{selectedEvent.hostName}</span></p> 
                <p>{selectedEvent.description}</p>
                <p>{selectedEvent.location}</p>
                <p><b>Start:</b> {formatDateTime(selectedEvent.startDatetime)}</p>
                <p><b>End:</b> {formatDateTime(selectedEvent.endDatetime)}</p>
                {!selectedEvent.isFriendEvent && <p><b>{selectedEvent.isPublic ? "Public" : "Private"}</b></p>}
                
                {eventAttendees.length > 0 && (
                   <div style={{ marginTop: "15px", padding: "12px", background: "#f4f6fb", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                      <p style={{ margin: "0 0 5px 0", color: "#333" }}><b>Accepted Invites:</b></p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#4f46e5", fontWeight: "bold" }}>
                         {eventAttendees.join(", ")}
                      </p>
                   </div>
                )}
              </>
            ) : (
              <form onSubmit={updateEvent}>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
                <input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
                <input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
                <input type="datetime-local" value={editStartDatetime} onChange={(e) => setEditStartDatetime(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
                <input type="datetime-local" value={editEndDatetime} onChange={(e) => setEditEndDatetime(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px" }} />
                <label style={{ display: "block", marginBottom: "15px" }}>
                  <input type="checkbox" checked={editIsPublic} onChange={(e) => setEditIsPublic(e.target.checked)} style={{ marginRight: "8px" }} />
                  {editIsPublic ? " Public Event" : " Private Event"}
                </label>
                <button type="submit" style={{ width: "100%", padding: "12px", background: "#667eea", color: "white", border: "none", borderRadius: "10px", marginBottom: "10px", cursor: "pointer" }}>Save</button>
                <button type="button" onClick={() => setIsEditing(false)} style={{ width: "100%", padding: "12px", background: "#f1f3f8", color: "#333", border: "none", borderRadius: "10px", cursor: "pointer" }}>Cancel</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- INVITE MODAL --- */}
      {inviteModalEvent && (
        <div className="modal-overlay" style={{ position: "fixed", inset: 0, zIndex: 99999, background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="modal-box" style={{ background: "white", padding: "40px", borderRadius: "18px", width: "420px", position: "relative", zIndex: 100000 }}>
            <h2 style={{ marginTop: 0 }}>Invite to {inviteModalEvent.title}</h2>
            <p style={{ marginBottom: "20px" }}>Select friends to invite:</p>
            <div style={{ maxHeight: "200px", overflowY: "auto", marginBottom: "20px" }}>
              {friends.length === 0 ? <p>You need to add friends first!</p> : (
                friends.map(friend => (
                  <div key={friend.id} className="friend-toggle" style={{ borderBottom: "none", padding: "5px 0" }}>
                    <div className="friend-info"><span>{friend.username}</span></div>
                    <input type="checkbox" style={{ width: "18px", height: "18px", accentColor: "#667eea" }} checked={friendsToInvite.includes(friend.id)} onChange={() => handleToggleInviteCheckbox(friend.id)} />
                  </div>
                ))
              )}
            </div>
            <button type="submit" onClick={sendInvites} style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: "10px", marginBottom: "10px", cursor: "pointer" }}>Send Invites</button>
            <button type="button" onClick={() => setInviteModalEvent(null)} style={{ width: "100%", padding: "12px", background: "#f1f3f8", color: "#333", border: "none", borderRadius: "10px", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;