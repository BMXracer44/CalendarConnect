package com.calendarconnect.backend.repository;

import com.calendarconnect.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.calendarconnect.backend.model.Event

import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

  /**
   * Find an event by event_id
   */
  Optional<Event> findByEventId(String event_id);

  /**
   * Find an event by start_datetime
   */
  Optional<Event> findByStartDateTime(String start_datetime);

  /**
   * Check if event_id exists
   */
  boolean existsByEventId(String event_id);

  /**
   * Check if start_datetime exists
   */
  boolean existsByStartDateTime(String start_datetime);
}
