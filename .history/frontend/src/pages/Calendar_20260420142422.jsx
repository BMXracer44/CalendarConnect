import { useState, useEffect, useContext } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'

import { AuthContext } from "../context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);

  // ================= LOAD USER EVENTS =================
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

      // Convert backend format → FullCalendar format
      const formatted = data.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start_datetime,
        end: event.end_datetime
      }));

      setEvents(formatted);

    } catch (err) {
      console.error("Error loading events:", err);
      setEvents([]);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadEvents();
    }
  }, [user]);

  // ================= CLICK DATE =================
  function handleDateClick(info) {
    info.view.calendar.changeView('timeGridDay', info.dateStr);
  }

  if (!user) {
    return <p>Please log in</p>;
  }

  return (
    <div>
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

        events={events}   {/* 🔥 NOW FROM API */}

        dateClick={handleDateClick}
      />
    </div>
  );
}

export default App;