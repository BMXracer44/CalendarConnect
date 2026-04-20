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

  // ================= POPUP STATE =================
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_datetime: "",
    end_datetime: ""
  });

  // ================= LOAD EVENTS =================
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

      const formatted = data.map(e => ({
        id: e.id,
        title: e.title,
        start: e.start_datetime,
        end: e.end_datetime
      }));

      setEvents(formatted);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.id) loadEvents();
  }, [user]);

  // ================= CLICK DATE → OPEN MODAL =================
  function handleDateClick(info) {
    setSelectedDate(info.dateStr);
    setFormData({
      ...formData,
      start_datetime: info.dateStr
    });
    setShowModal(true);
  }

  // ================= FORM CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ================= CREATE EVENT =================
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
        setFormData({
          title: "",
          description: "",
          start_datetime: "",
          end_datetime: ""
        });

        loadEvents(); // refresh calendar
      }

    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Please log in</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Calendar</h1>

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
        editable={true}
        selectable={true}
        events={events}
        dateClick={handleDateClick}
      />

      {/* ================= POPUP MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h2>Create Event</h2>
            <p>Date: {selectedDate}</p>

            <form onSubmit={createEvent}>

              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
              />

              <input
                type="datetime-local"
                name="start_datetime"
                value={formData.start_datetime}
                onChange={handleChange}
                required
              />

              <input
                type="datetime-local"
                name="end_datetime"
                value={formData.end_datetime}
                onChange={handleChange}
                required
              />

              <button type="submit">Create Event</button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
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