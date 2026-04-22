import { useState, useEffect, useContext } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import { AuthContext } from "../context/AuthContext";

function Calendar() {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);

  // MODAL STATE
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_datetime: "",
    end_datetime: ""
  });

  // LOAD EVENTS
  const loadEvents = async () => {
    try {
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
        data.map(e => ({
          id: e.id,
          title: e.title,
          start: e.start_datetime,
          end: e.end_datetime
        }))
      );

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.id) loadEvents();
  }, [user]);

  // OPEN MODAL (BUTTON)
  const openModal = () => {
    setFormData({
      title: "",
      description: "",
      start_datetime: "",
      end_datetime: ""
    });
    setShowModal(true);
  };

  // CLOSE MODAL
  const closeModal = () => {
    setShowModal(false);
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // CREATE EVENT
  const createEvent = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:8080/api/events/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({
            creator_id: user.id,
            title: formData.title,
            description: formData.description,
            start_datetime: formData.start_datetime,
            end_datetime: formData.end_datetime
          })
        }
      );

      if (res.ok) {
        setShowModal(false);
        loadEvents();
      }

    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ padding: "20px" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px"
      }}>
        <h1>My Calendar</h1>

        <button
          onClick={openModal}
          style={{
            padding: "10px 14px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
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
        headerToolbar={{
          left: 'prev next today',
          center: 'title',
          right: 'dayGridMonth timeGridWeek timeGridDay'
        }}
        events={events}
      />

      {/* ================= MODAL (FIXED) ================= */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 99999   // 🔥 IMPORTANT FIX
        }}>
          <div style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            width: "400px"
          }}>

            <h2>Add Event</h2>

            <form onSubmit={createEvent}>

              <input
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{ width: "100%", marginBottom: "10px" }}
              />

              <input
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                style={{ width: "100%", marginBottom: "10px" }}
              />

              <input
                type="datetime-local"
                name="start_datetime"
                value={formData.start_datetime}
                onChange={handleChange}
                required
                style={{ width: "100%", marginBottom: "10px" }}
              />

              <input
                type="datetime-local"
                name="end_datetime"
                value={formData.end_datetime}
                onChange={handleChange}
                required
                style={{ width: "100%", marginBottom: "10px" }}
              />

              <button type="submit">Create</button>

              <button
                type="button"
                onClick={closeModal}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Calendar;