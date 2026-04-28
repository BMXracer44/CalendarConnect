<<<<<<< Updated upstream
import { useState, useEffect } from 'react'
=======
import { useState } from 'react'
>>>>>>> Stashed changes
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import Switch from 'react-switch'

function App() {
<<<<<<< Updated upstream
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

  function handleAddEventClick() {
    setSelectedDate(new Date().toISOString())
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

      {/* ✅ ONLY FIX: move month title slightly up */}
      <style>
        {`
          .fc .fc-toolbar-title {
            position: relative;
            top: -6px; /* tweak: -4px to -8px depending on taste */
          }
        `}
      </style>

      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          bootstrap5Plugin
        ]}
        initialView="dayGridMonth"

        customButtons={{
          addEventButton: {
            text: 'Add Event',
            click: handleAddEventClick
          }
        }}

        headerToolbar={{
          left: 'prev next today',
          center: 'title addEventButton',
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
            <button onClick={() => setShowModal(false)} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
=======
  const [friends, setFriends] = useState([
    {
      id: 1,
      name: 'Alex',
      color: '#ff6b6b',
      enabled: true
    },
    {
      id: 2,
      name: 'Blair',
      color: '#4dabf7',
      enabled: true
    },
    {
      id: 3,
      name: 'Fry',
      color: '#51cf66',
      enabled: true
    }
  ])

  const friendRequests = ['Chris', 'Morgan']

  const events = [
    { title: 'Team Meeting', date: '2026-04-13' },
    { title: 'Project Demo', date: '2026-04-15' },
    { title: 'Study Session', date: '2026-04-18' },
    {
      title: 'Craft Night',
      start: '2026-04-20T19:00:00',
      end: '2026-04-20T21:00:00'
    },

    // Added friend events
    {
      title: "Alex's Birthday",
      date: '2026-04-10',
      friendId: 1,
      color: '#ff6b6b'
    },
    {
      title: "Blair's Soccer Game",
      date: '2026-04-14',
      friendId: 2,
      color: '#4dabf7'
    },
    {
      title: "Fry's Dinner",
      date: '2026-04-22',
      friendId: 3,
      color: '#51cf66'
    }
  ]

  function handleDateClick(info) {
    info.view.calendar.changeView('timeGridDay', info.dateStr)
  }

  function toggleFriend(id) {
    setFriends(
      friends.map((friend) =>
        friend.id === id
          ? { ...friend, enabled: !friend.enabled }
          : friend
      )
    )
  }

  const visibleEvents = events.filter((event) => {
    if (!event.friendId) return true

    const friend = friends.find((f) => f.id === event.friendId)
    return friend?.enabled
  })

  return (

    <div style={{ display: 'flex' }}>

      <div style={{ flex: 1 }}>
        <div style={{}}>
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
            events={visibleEvents}
            dateClick={handleDateClick}
          />
        </div>
      </div>

      {/* Friend Bar*/}
      <div
        style={{
          width: '200px',
          padding: '20px',
          borderLeft: '1px solid #ddd',
          backgroundColor: '#f9f9f9'
        }}
      /*  editable={true}
        selectable={true}
        events={events}
        dateClick={handleDateClick}
        */
      >
        {/* Friend Requests */}
        <h2>Friend Requests</h2>
        {friendRequests.map((request, index) => (
          <div
            key={index}
            style={{
              padding: '10px',
              marginBottom: '10px',
              background: 'white',
              borderRadius: '8px'
            }}
          >
            {request}
          </div>
        ))}

        <hr />

        {/* Friends Toggle List */}
        <h2>Friends</h2>
        {friends.map((friend) => (
          <div
            key={friend.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              padding: '6px',
              background: 'white',
              borderLeft: `5px solid ${friend.color}`,
              borderRadius: '8px'
            }}
          >
            <span>{friend.name}</span>

            <Switch
              checked={friend.enabled}
              onChange={() => toggleFriend(friend.id)}
              onColor={friend.color}
              uncheckedIcon={false}
              checkedIcon={false}
            />
          </div>
        ))}
      </div>
>>>>>>> Stashed changes
    </div>
  )
}

export default App