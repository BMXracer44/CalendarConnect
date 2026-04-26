package com.calendarconnect.backend.controller;

import com.calendarconnect.backend.dto.EventCreateRequest;
import com.calendarconnect.backend.dto.EventResponse;
import com.calendarconnect.backend.model.Event;
import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/events")
public class EventController {

  @Autowired
  private EventService eventService;

  /**
   * Add event endpoint to create new event
   */
  @PostMapping
  public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventCreateRequest request) {
    // Security issue fixed with springboot security
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();
    Integer currentUserId = currentUser.getId();

    Event savedEvent = eventService.createEvent(request, currentUserId);

    EventResponse responseBody = EventResponse.fromEntity(savedEvent);

    return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
  }

}
