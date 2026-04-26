package com.calendarconnect.backend.controller;

import com.calendarconnect.backend.dto.EventCreateRequest;
import com.calendarconnect.backend.dto.EventResponse;
import com.calendarconnect.backend.model.Event;
import com.calendarconnect.backend.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    // =========================
    // CREATE EVENT
    // =========================
    @PostMapping
    public ResponseEntity<?> createEvent(
            @Valid @RequestBody EventCreateRequest request,
            @RequestParam Integer userId
    ) {
        try {
            Event savedEvent = eventService.createEvent(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(EventResponse.fromEntity(savedEvent));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // =========================
    // GET USER EVENTS (MISSING BEFORE)
    // =========================
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserEvents(@PathVariable Integer userId) {
        return ResponseEntity.ok(eventService.getEventsByUser(userId));
    }
}