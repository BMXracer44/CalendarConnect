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

<<<<<<< HEAD
    List<Event> findByIsPublicTrue();
}
=======
  List<Event> findByIsPublicTrue();

  //Checks if a specific user has any events that overlap with a proposed time frame.
  @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Event e " +
        "WHERE e.creatorId = :creatorId " +
        "AND e.startDatetime < :newEndTime " +
        "AND e.endDatetime > :newStartTime")
    boolean existsOverlappingEvent(
        @Param("creatorId") Integer creatorId, 
        @Param("newStartTime") LocalDateTime newStartTime, 
        @Param("newEndTime") LocalDateTime newEndTime
    );
}
>>>>>>> d6bd128eade068ec57021a6951c1a6b0e649ad8f
