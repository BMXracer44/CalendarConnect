package com.calendarconnect.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.calendarconnect.backend.dto.EventCreateRequest;
import com.calendarconnect.backend.dto.EventResponse;
import com.calendarconnect.backend.dto.EventUpdateRequest;
import com.calendarconnect.backend.model.Event;
import com.calendarconnect.backend.model.EventAttendee;
import com.calendarconnect.backend.repository.EventAttendeeRepository;
import com.calendarconnect.backend.repository.EventRepository;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    // =========================
    // CREATE EVENT
    // =========================
    public Event createEvent(EventCreateRequest request, Long userId) {
        
        // 1. Check overlapping events
        boolean hasConflict = eventRepository.existsOverlappingEvent(
                userId,
                request.getStartDatetime(),
                request.getEndDatetime()
        );
        if (hasConflict) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This event overlaps with an existing event on your calendar."
            );
        }

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setStartDatetime(request.getStartDatetime());
        event.setEndDatetime(request.getEndDatetime());
        event.setIsPublic(request.getIsPublic());
        event.setCreatorId(userId);
        
        return eventRepository.save(event);
    }

    // =========================
    // GET EVENTS BY USER
    // =========================
    public List<EventResponse> getEventsByUser(Long userId) {

        return eventRepository.findByCreatorId(userId)
                .stream()
                .map(EventResponse::fromEntity)
                .toList();
    }

    // =========================
    // UPDATE EVENT
    // =========================
    public Event updateEvent(Long id, EventUpdateRequest request) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id " + id));
        
        //Adding event conflict logic to update
        if(request.getStartDatetime() != null && request.getEndDatetime() != null){
            boolean isConflict = eventRepository.existsOverlappingEventForUpdate(
                event.getCreatorId(),
                event.getId(),
                request.getStartDatetime(),
                request.getEndDatetime()
            );
            if(isConflict){
                throw new RuntimeException("Event time overlaps with another event!");
            }
        }

        if (request.getTitle() != null) {
            event.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            event.setDescription(request.getDescription());
        }

        if (request.getLocation() != null) {
            event.setLocation(request.getLocation());
        }

        if (request.getStartDatetime() != null) {
            event.setStartDatetime(request.getStartDatetime());
        }

        if (request.getEndDatetime() != null) {
            event.setEndDatetime(request.getEndDatetime());
        }

        if (request.getIsPublic() != null) {
            event.setIsPublic(request.getIsPublic());
        }

        return eventRepository.save(event);
    }

    // DELETE EVENT
    public void deleteEvent(Long id) {

        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found with id " + id);
        }

        eventRepository.deleteById(id);
    }

    public List<EventResponse> getPublicEventsByUser(Long userId) {
        return eventRepository.findByCreatorIdAndIsPublicTrue(userId)
                .stream()
                .map(EventResponse::fromEntity)
                .toList();
    }

    @Autowired
    private EventAttendeeRepository eventAttendeeRepository;

    // INVITE FRIEND TO EVENT
    public void inviteFriend(Long eventId, Long friendId) {
        EventAttendee invite = new EventAttendee(eventId, friendId, "invited");
        eventAttendeeRepository.save(invite);
    }

    // UPDATE INVITE STATUS (Accept/Decline)
    public void respondToInvite(Long eventId, Long userId, String status) {
        EventAttendee invite = eventAttendeeRepository.findById(new com.calendarconnect.backend.model.EventAttendeeId(eventId, userId))
            .orElseThrow(() -> new RuntimeException("Invite not found"));
        
        invite.setStatus(status); // "going" or "declined"
        eventAttendeeRepository.save(invite);
    }

    // GET PENDING INVITES FOR USER
    public List<EventAttendee> getPendingInvites(Long userId) {
        return eventAttendeeRepository.findByUserIdAndStatus(userId, "invited");
    }
}
