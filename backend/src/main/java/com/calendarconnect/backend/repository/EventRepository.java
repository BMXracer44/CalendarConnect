package com.calendarconnect.backend.repository;

import com.calendarconnect.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStartDatetime(LocalDateTime startDatetime);

    boolean existsByStartDatetime(LocalDateTime startDatetime);

    List<Event> findByCreatorId(Long creatorId);

    List<Event> findByIsPublicTrue();
}