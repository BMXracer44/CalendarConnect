import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import Switch from 'react-switch'

function App() {
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
  // Friend requests - not working yet
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

    // Friend events - Manually added
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

      {/* Friend Sidebar*/}
      <div
        style={{
          width: '200px',
          padding: '15px',
          borderLeft: '1px solid #ddd',
          backgroundColor: '#f9f9f9'
        }}
      >
        {/* Friend Requests */}
        <h2>Friend Requests</h2>
        {friendRequests.map((request, index) => (
          <div
            key={index}
            style={{
              padding: '6px',
              marginBottom: '5px',
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
            {/* Toggle Switch */}
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
    </div>
  );
}

export default Calendar;