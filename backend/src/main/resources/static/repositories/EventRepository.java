package com.calendarconnect.backend.repository;

import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Get all events for a specific user
    Optional<Event> findByUser(User user);

    // Get events by title
    Optional<Event> findByTitle(String title);
}
