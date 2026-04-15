package com.calendarconnect.backend.repository;

import com.calendarconnect.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.list;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

  List<Event> findByStartDatetime(LocalDateTime startDatetime);

  boolean existsByStartDatetime(LocalDateTime startDatetime);

  List<Event> findByCreatorId(Integer creatorId);
    

  List<Event> findByIsPublicTrue();
}
