package com.calendarconnect.backend.service;

import com.calendarconnect.backend.dto.EventCreateRequest;
import com.calendarconnect.backend.model.Event;
import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.repository.EventRepository;
import com.calendarconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public Event createEvent(EventCreateRequest request, Integer userId) {

        if (userId == null) {
            throw new RuntimeException("User ID is required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setStartDatetime(request.getStartDatetime());
        event.setEndDatetime(request.getEndDatetime());
        event.setIsPublic(request.getIsPublic());
        event.setUser(user);

        return eventRepository.save(event);
    }
}