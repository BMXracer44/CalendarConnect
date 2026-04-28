import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import Switch from 'react-switch'

function App() {
  const events = [
    { title: 'Team Meeting', date: '2026-04-13' },
    { title: 'Project Demo', date: '2026-04-15' },
    { title: 'Study Session', date: '2026-04-18' },
    { title: 'Craft Night', start: '2026-04-20T19:00:00', end: '2026-04-20T21:00:00' }
  ]

  function handleDateClick(info){
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
    // <div style={{ maxWidth: '100%', margin: '0', padding: '20px' }}>
    <div style={{}}>
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
        events={events}
        dateClick={handleDateClick}
      />
    </div>
  )
}

export default App