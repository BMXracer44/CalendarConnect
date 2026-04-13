package com.calendarconnect.backend.dto;

import java.time.LocalDateTime;

public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;

    public EventResponse() {
    }

    private EventResponse mapToResponse(Event event) {
        return new EventResponse(
            event.getId(),
            event.getTitle(),
            event.getDescription(),
            event.getStartTime(),
            event.getEndTime(),
            event.getLocation()
        );
    }

    public EventResponse(Long id, String title, String description,
                         LocalDateTime startTime, LocalDateTime endTime,
                         String location) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}