package com.calendarconnect.backend.dto;

import com.calendarconnect.backend.model.Event;
import java.time.LocalDateTime;

/**
 * This class packages the event data to send back to the React frontend.
 */
public class EventResponse {

    private Integer id;
    private Integer creatorId;
    
    // In the future, when UserService is set up, add a field here 
    // like 'private String creatorName;' so React doesn't have to look it up
    
    private String title;
    private String description;
    private String location;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private boolean isPublic;
    private LocalDateTime createdAt;

    // --- Constructors ---

    public EventResponse() {
    }

    public EventResponse(Integer id, Integer creatorId, String title, String description, 
                         String location, LocalDateTime startDatetime, LocalDateTime endDatetime, 
                         boolean isPublic, LocalDateTime createdAt) {
        this.id = id;
        this.creatorId = creatorId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.startDatetime = startDatetime;
        this.endDatetime = endDatetime;
        this.isPublic = isPublic;
        this.createdAt = createdAt;
    }

    // --- Helper Method ---
    
    /**
     * This takes a raw database Event and converts it into this safe EventResponse.
     */
    public static EventResponse fromEntity(Event event) {
        return new EventResponse(
            event.getId(),
            event.getCreatorId(),
            event.getTitle(),
            event.getDescription(),
            event.getLocation(),
            event.getStartDatetime(),
            event.getEndDatetime(),
            event.isPublic(),
            event.getCreatedAt()
        );
    }

    // --- Getters and Setters ---
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getCreatorId() { return creatorId; }
    public void setCreatorId(Integer creatorId) { this.creatorId = creatorId; }

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

    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}