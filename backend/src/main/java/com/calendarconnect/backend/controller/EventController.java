package com.calendarconnect.backend.controller;

import com.calendarconnect.backend.dto.EventCreateRequest;
import com.calendarconnect.backend.model.Event;
import com.calendarconnect.backend.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
public class EventController {

  @Autowired
  private EventService eventService;

  /**
   * Add event endpoint to create new event
   */
  @PostMapping("/add")
  public ResponseEntity<Event> createEvent(@Valid @RequestBody EventCreateRequest request) {
    // TODO: Security implementation
    //When fully finished, we should extract ID from the user's JWT token
    //Hardcoded currently
    Integer currentUserId = 1;

    Event savedEvent = eventService.createEvent(request, currentUserId);

    return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
  }

}
