package com.calendarconnect.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.calendarconnect.backend.dto.EventCreateRequest;
import com.calendarconnect.backend.dto.EventResponse;
import com.calendarconnect.backend.dto.EventUpdateRequest;
import com.calendarconnect.backend.model.Event;
import com.calendarconnect.backend.service.EventService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    @Autowired
    private EventService eventService;

    // CREATE
    @PostMapping
    public ResponseEntity<?> createEvent(
            @Valid @RequestBody EventCreateRequest request,
            @RequestParam Long userId
    ) {
        try {
            Event saved = eventService.createEvent(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(EventResponse.fromEntity(saved));

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        }
    }

    // GET
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserEvents(@PathVariable Long userId) {
        return ResponseEntity.ok(eventService.getEventsByUser(userId));
    }

    // UPDATE (FIXED RESPONSE FORMAT)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @RequestBody EventUpdateRequest request
    ) {
        try {
            Event updated = eventService.updateEvent(id, request);
            return ResponseEntity.ok(EventResponse.fromEntity(updated));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok(Map.of("message", "Deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}/public")
    public ResponseEntity<?> getPublicUserEvents(@PathVariable Long userId) {
        return ResponseEntity.ok(eventService.getPublicEventsByUser(userId));
    }

    // SEND INVITE
    @PostMapping("/{eventId}/invite/{friendId}")
    public ResponseEntity<?> inviteFriend(@PathVariable Long eventId, @PathVariable Long friendId) {
        eventService.inviteFriend(eventId, friendId);
        return ResponseEntity.ok(Map.of("message", "Invite sent successfully"));
    }

    // RESPOND TO INVITE (Accept/Decline)
    @PutMapping("/{eventId}/respond/{userId}")
    public ResponseEntity<?> respondToInvite(@PathVariable Long eventId, @PathVariable Long userId, @RequestParam String status) {
        eventService.respondToInvite(eventId, userId, status);
        return ResponseEntity.ok(Map.of("message", "Response recorded"));
    }

    // GET PENDING INVITES (For the Notification Bell)
    @GetMapping("/invites/{userId}")
    public ResponseEntity<?> getPendingInvites(@PathVariable Long userId) {
        return ResponseEntity.ok(eventService.getPendingInvites(userId));
    }

    // GET SINGLE EVENT (For the notification bell)
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        Event event = eventService.updateEvent(id, new EventUpdateRequest()); // Quick hack to fetch event safely
        return ResponseEntity.ok(EventResponse.fromEntity(event));
    }

    // GET ACCEPTED EVENTS FOR A USER'S CALENDAR
    @GetMapping("/accepted/{userId}")
    public ResponseEntity<?> getAcceptedEvents(@PathVariable Long userId) {
        return ResponseEntity.ok(eventService.getAcceptedEvents(userId));
    }

    // GET USERNAMES OF ACCEPTED ATTENDEES FOR AN EVENT MODAL
    @GetMapping("/{eventId}/attendees")
    public ResponseEntity<?> getEventAttendees(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventService.getEventAttendees(eventId));
    }
}