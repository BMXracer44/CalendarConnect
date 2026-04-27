package com.calendarconnect.backend.dto;

import java.time.LocalDateTime;

/**
 * This class handles the data for editing an existing event.
 */
public class EventUpdateRequest {

    private String title;
    private String description;
    private String location;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    
    // We strictly use the object 'Boolean' instead of primitive 'boolean' here.
    // A primitive 'boolean' defaults to 'false' if missing, which might accidentally 
    // make a public event private! The object 'Boolean' defaults to 'null', which is safe.
    private Boolean isPublic; 

    // --- Constructors ---

    public EventUpdateRequest() {
    }

    public EventUpdateRequest(String title, String description, String location, 
                              LocalDateTime startDatetime, LocalDateTime endDatetime, Boolean isPublic) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.startDatetime = startDatetime;
        this.endDatetime = endDatetime;
        this.isPublic = isPublic;
    }

    // --- Getters and Setters ---

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getStartDatetime() { return startDatetime; }
    public void setStartDatetime(LocalDateTime startDatetime) { this.startDatetime = startDatetime; }

    public LocalDateTime getEndDatetime() { return endDatetime; }
    public void setEndDatetime(LocalDateTime endDatetime) { this.endDatetime = endDatetime; }

    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
}