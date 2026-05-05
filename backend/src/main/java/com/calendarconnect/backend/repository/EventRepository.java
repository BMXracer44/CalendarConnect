package com.calendarconnect.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.calendarconnect.backend.model.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStartDatetime(LocalDateTime startDatetime);

    boolean existsByStartDatetime(LocalDateTime startDatetime);

    List<Event> findByCreatorId(Long creatorId);

    List<Event> findByIsPublicTrue();

    List<Event> findByCreatorIdAndIsPublicTrue(Long creatorId);

    // Checks if a specific user has overlapping events
    // Creating a new event with no eventID
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Event e " +
           "WHERE e.creatorId = :creatorId " +
           "AND e.startDatetime < :newEndTime " +
           "AND e.endDatetime > :newStartTime")
    boolean existsOverlappingEvent(
            @Param("creatorId") Long creatorId,
            @Param("newStartTime") LocalDateTime newStartTime,
            @Param("newEndTime") LocalDateTime newEndTime
    );

    // For updating an existing event (exclude itself)
    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Event e " +
        "WHERE e.creatorId = :creatorId " +
        "AND e.id <> :eventId " +
        "AND e.startDatetime < :newEndTime " +
        "AND e.endDatetime > :newStartTime")
    boolean existsOverlappingEventForUpdate(
            @Param("creatorId") Long creatorId,
            @Param("eventId") Long eventId,
            @Param("newStartTime") LocalDateTime newStartTime,
            @Param("newEndTime") LocalDateTime newEndTime
    );

    @Query(value = "SELECT u.username FROM users u JOIN event_attendees ea ON u.id = ea.user_id WHERE ea.event_id = :eventId AND ea.status = 'going'", nativeQuery = true)
    List<String> findAttendeeUsernames(@Param("eventId") Long eventId);
}