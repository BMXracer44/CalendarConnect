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
  const [showModal, setShowModal] = useState(false);

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
        `/api/events/user/${user.id}`,
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

  // ================= OPEN MODAL =================
  const openModal = () => {
    setFormData({
      title: "",
      description: "",
      start_datetime: "",
      end_datetime: ""
    });
    setShowModal(true);
  };

  // ================= DATE CLICK =================
  const handleDateClick = (info) => {
    setFormData(prev => ({
      ...prev,
      start_datetime: info.dateStr
    }));
    setShowModal(true);
  };

  // ================= INPUT CHANGE =================
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
        "/api/events/create",
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
    <div className="calendar-page">

      {/* HEADER */}
      <div className="calendar-header">
        <h1 className="calendar-title">My Calendar</h1>

        <button className="calendar-add-btn" onClick={openModal}>
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
        editable={true}
        selectable={true}
        events={events}
        dateClick={handleDateClick}
      />

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h2>Add Event</h2>

            <form onSubmit={createEvent}>

              <input
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <input
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

              <button type="submit">Create</button>

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