<<<<<<< HEAD
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

  // POPUP STATE
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

  // CLICK ON DAY (NO POPUP ANYMORE)
  function handleDateClick(info) {
    // Optional: still store selected date
    setFormData(prev => ({
      ...prev,
      start_datetime: info.dateStr
    }));

    // ❌ removed: setShowModal(true);
  }

  // OPEN FROM BUTTON
  const openModal = () => {
    setFormData({
      title: "",
      description: "",
      start_datetime: "",
      end_datetime: ""
    });
    setShowModal(true);
  };
=======
import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'

function App() {
  const [currentEvents, setCurrentEvents] = useState([
    { title: 'Team Meeting', date: '2026-04-13' },
    { title: 'Project Demo', date: '2026-04-15' },
    { title: 'Study Session', date: '2026-04-18' },
    { title: 'Craft Night', start: '2026-04-20T19:00:00', end: '2026-04-20T21:00:00' }
  ])

  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: ''
  })

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto'
  }, [showModal])

  function handleDateClick(info) {
    if (info.view.type === 'dayGridMonth') {
      info.view.calendar.changeView('timeGridDay', info.dateStr)
      return
    }

    setSelectedDate(info.dateStr)
    setShowModal(true)
  }

  function handleTimeSelect(info) {
    setSelectedDate(info.startStr)
    setShowModal(true)
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  function handleSubmit() {
    if (!formData.title) return

    const dateOnly = selectedDate.split('T')[0]

    const start = `${dateOnly}T${formData.startTime || '00:00'}`
    const end = `${dateOnly}T${formData.endTime || '01:00'}`

    const newEvent = {
      title: formData.title,
      start,
      end,
      extendedProps: {
        description: formData.description
      }
    }

    setCurrentEvents([...currentEvents, newEvent])

    // reset
    setShowModal(false)
    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: ''
    })
  }

  return (
    <div>
      <h1>My Calendar</h1>


  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // CREATE EVENT
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
    <div style={{ padding: "20px" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px"
      }}>
        <h1>My Calendar</h1>

        <button
          onClick={openModal}
          style={{
            padding: "10px 15px",
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
        editable={true}
        selectable={true}
        events={currentEvents}
        dateClick={handleDateClick}
        select={handleTimeSelect}
      />

<<<<<<< HEAD
      {/* POPUP */}
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

=======
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: 'white',
              padding: '20px',
              width: '400px',
              borderRadius: '8px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Create Event</h3>

            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
              style={{ width: '100%', marginBottom: '10px' }}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              style={{ width: '100%', marginBottom: '10px' }}
            />

            <label>Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              style={{ width: '100%', marginBottom: '10px' }}
            />

            <label>End Time:</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              style={{ width: '100%', marginBottom: '10px' }}
            />

            <button onClick={handleSubmit}>Add Event</button>
            <button
              onClick={() => setShowModal(false)}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
>>>>>>> 96d559da35ce8c0be979e7eed03f626366a42b60
    </div>
  );
}

export default Calendar;