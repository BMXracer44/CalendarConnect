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

  // ================= LOAD EVENTS FROM API =================
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

      // Convert backend format → FullCalendar format
      const formattedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        start: event.start_datetime,
        end: event.end_datetime
      }));

      setEvents(formattedEvents);

    } catch (err) {
      console.error("Failed to load events:", err);
      setEvents([]);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadEvents();
    }
  }, [user]);

  // ================= DATE CLICK =================
  function handleDateClick(info) {
    info.view.calendar.changeView('timeGridDay', info.dateStr);
  }

  if (!user) {
    return <p>Please log in to view your calendar.</p>;
  }

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

        /* 🔥 EVENTS FROM API */
        events={events}

        dateClick={handleDateClick}
      />
    </div>
  );
}

export default Calendar;