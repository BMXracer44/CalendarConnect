package com.calendarconnect.backend.controller;

import com.calendarconnect.backend.dto.EventCreateRequest;
import com.calendarconnect.backend.dto.EventResponse;
import com.calendarconnect.backend.dto.EventUpdateRequest;
import com.calendarconnect.backend.model.Event;
import com.calendarconnect.backend.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
            Event saved = eventService.createEvent(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(EventResponse.fromEntity(saved));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // =========================
    // GET USER EVENTS
    // =========================
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserEvents(@PathVariable Integer userId) {
        try {
            List<EventResponse> events = eventService.getEventsByUser(userId);
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // =========================
    // UPDATE EVENT (FIX FOR YOUR 404)
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Integer id,
            @RequestBody EventUpdateRequest request
    ) {
        try {
            Event updated = eventService.updateEvent(id, request);

            return ResponseEntity.ok(EventResponse.fromEntity(updated));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "error", e.getMessage(),
                            "status", 404
                    ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // =========================
    // DELETE EVENT (OPTIONAL BUT USEFUL)
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Integer id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}