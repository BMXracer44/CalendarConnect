package com.calendarconnect.backend.repository;

import com.calendarconnect.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStartDatetime(LocalDateTime startDatetime);

    boolean existsByStartDatetime(LocalDateTime startDatetime);

    List<Event> findByCreatorId(Long creatorId);

    List<Event> findByIsPublicTrue();

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
}