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
        events={currentEvents}
        dateClick={handleDateClick}
        select={handleTimeSelect}
      />

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
    </div>
  )
}
// Testing change for gitdesktop 
export default App