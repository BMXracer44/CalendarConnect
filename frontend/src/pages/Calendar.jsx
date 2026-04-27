import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import { useState }  from "react"
import '../index.css'

function App() {
  const events = [
    { title: 'Team Meeting', date: '2026-04-13' },
    { title: 'Project Demo', date: '2026-04-15' },
    { title: 'Study Session', date: '2026-04-18' },
    { title: 'Craft Night', start: '2026-04-20T19:00:00', end: '2026-04-20T21:00:00', location: 'UC Down Under' }
  ]
  const [selectedEvent, setSelectedEvent] = useState(null);

  function handleDateClick(info){
    info.view.calendar.changeView('timeGridDay', info.dateStr)
  }

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
  };

  return (
    <div className = "container">
      <h1 className = "page-title">My Calendar</h1>
      <div className = "calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin]}
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
          eventClick={handleEventClick}
        />
      </div>
      {selectedEvent &&(
        <div className = "popup-overlay">
          <div className = "popup-box">
            <h2>{selectedEvent.title}</h2>
            <p>Start: {selectedEvent.start?.toLocaleString()}</p>
            <p>End: {selectedEvent.end?.toLocaleString()}</p>
            <button onClick={() => setSelectedEvent(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}


export default App