package com.calendarconnect.backend.service;

import com.calendarconnect.backend.dto.EventCreateRequest;
import com.calendarconnect.backend.model.Event;
import com.calendarconnect.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventService {

    @Autowired 
    private EventRepository eventRepository;

    /**
     * Create Event in database
     */
    public Event createEvent(EventCreateRequest request, Integer creatorId){
        Event newEvent = new Event();

        newEvent.setTitle(request.getTitle());
        newEvent.setDescription(request.getDescription());
        newEvent.setLocation(request.getLocation());
        newEvent.setStartDateTime(request.getStartDateTime());
        newEvent.setEndDateTime(request.getEndDateTime());
        newEvent.setPublic(request.getIsPublic());

        //Vital security data frontend is not allowed to send
        newEvent.setCreatorId(creatorId);

        //Save to database
        return eventRepository.save(newEvent);
    }

    public Event updateEvent(Integer eventId, EventUpdateRequest request, Integer currentUserId) {
    
        // 1. Find the existing event in the database (or throw an error if it doesn't exist)
        Event existingEvent = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        // 2. Security Check: Ensure the person editing the event is actually the creator!
        if (!existingEvent.getCreatorId().equals(currentUserId)) {
            throw new RuntimeException("You do not have permission to edit this event");
        }

        // 3. Selectively update only the fields the user actually sent
        if (request.getTitle() != null) {
            existingEvent.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            existingEvent.setDescription(request.getDescription());
        }
        if (request.getLocation() != null) {
            existingEvent.setLocation(request.getLocation());
        }
        if (request.getStartDatetime() != null) {
            existingEvent.setStartDatetime(request.getStartDatetime());
        }
        if (request.getEndDatetime() != null) {
            existingEvent.setEndDatetime(request.getEndDatetime());
        }
        if (request.getIsPublic() != null) {
            existingEvent.setPublic(request.getIsPublic());
        }

        // 4. Save the updated entity back to the database
        return eventRepository.save(existingEvent);
    }
}