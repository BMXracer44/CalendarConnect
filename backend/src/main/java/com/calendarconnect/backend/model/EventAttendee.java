package com.calendarconnect.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "event_attendees")
@IdClass(EventAttendeeId.class)
public class EventAttendee {

    @Id
    @Column(name = "event_id")
    private Long eventId;

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "status")
    private String status = "invited"; // Defaults to invited!

    public EventAttendee() {}

    public EventAttendee(Long eventId, Long userId, String status) {
        this.eventId = eventId;
        this.userId = userId;
        this.status = status;
    }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}