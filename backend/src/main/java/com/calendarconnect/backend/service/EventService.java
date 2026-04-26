package com.calendarconnect.backend.service;

import com.calendarconnect.backend.dto.EventCreateRequest;
import com.calendarconnect.backend.dto.EventUpdateRequest;
import com.calendarconnect.backend.dto.EventResponse;
import com.calendarconnect.backend.model.Event;
import com.calendarconnect.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public Event createEvent(EventCreateRequest request, Integer userId) {

        // 1. Check for time conflicts BEFORE doing anything else
        boolean hasConflict = eventRepository.existsOverlappingEvent(
                userId, 
                request.getStartDatetime(), 
                request.getEndDatetime()
        );

        if (hasConflict) {
            // This immediately stops the method and sends a 409 Conflict error to React
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
        event.setPublic(request.getIsPublic());
        event.setCreatorId(userId);

        return eventRepository.save(event);
    }

    public List<EventResponse> getEventsByUser(Integer userId) {

        return eventRepository.findByCreatorId(userId)
                .stream()
                .map(EventResponse::fromEntity)
                .toList();
    }

    public Event updateEvent(Integer id, EventUpdateRequest request) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id " + id));

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
            event.setPublic(request.getIsPublic());
        }

        return eventRepository.save(event);
    }

    public void deleteEvent(Integer id) {

        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Event not found with id " + id);
        }

        eventRepository.deleteById(id);
    }
}