package com.calendarconnect.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.calendarconnect.backend.model.EventAttendee;
import com.calendarconnect.backend.model.EventAttendeeId;

public interface EventAttendeeRepository extends JpaRepository<EventAttendee, EventAttendeeId> {
    // Find all pending invites for a specific user (for the notification bell)
    List<EventAttendee> findByUserIdAndStatus(Long userId, String status);
}