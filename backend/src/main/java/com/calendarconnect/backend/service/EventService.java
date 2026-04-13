package com.calendarconnect.backend.service;

import com.calendarconnect.backend.model.Event;
import com.calendarconnect.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;
    
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    /**
     * Create Event
     */
    public Event createEvent(Event event) throws Exception {

        if (event.getTitle() == null || event.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }

        if (event.getStartDate() == null) {
            throw new Exception("Start date is required");
        }

        return eventRepository.save(event);
    }

    /**
     * Get all events
     */
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    /**
     * Get event by ID
     */
    public Event getEventById(Long id) throws Exception {
        return eventRepository.findById(id)
                .orElseThrow(() -> new Exception("Event not found"));
    }

    /**
     * Update event
     */
    public Event updateEvent(Long id, Event updatedEvent) throws Exception {

        Event event = getEventById(id);

        event.setTitle(updatedEvent.getTitle());
        event.setDescription(updatedEvent.getDescription());
        event.setStartDate(updatedEvent.getStartDate());
        event.setEndDate(updatedEvent.getEndDate());
        event.setLocation(updatedEvent.getLocation());

        return eventRepository.save(event);
    }

    /**
     * Delete event
     */
    public void deleteEvent(Long id) throws Exception {

        Event event = getEventById(id);
        eventRepository.delete(event);
    }
}