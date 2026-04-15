package com.calendarconnect.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * This class acts as a secure container for the data coming from the frontend.
 * It ONLY contains the fields the user is allowed to fill out when making an event.
 */
public class EventCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    
    private String location;

    @NotNull(message = "Start date and time are required")
    private LocalDateTime startDatetime;

    @NotNull(message = "End date and time are required")
    private LocalDateTime endDatetime;

    @NotNull(message = "Public status must be specified")
    private Boolean isPublic;

    // --- Constructors ---
    
    public EventCreateRequest() {
    }

    public EventCreateRequest(String title, String description, String location, 
                              LocalDateTime startDatetime, LocalDateTime endDatetime, Boolean isPublic) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.startDatetime = startDatetime;
        this.endDatetime = endDatetime;
        this.isPublic = isPublic;
    }

    // --- Getters and Setters ---

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getStartDatetime() {
        return startDatetime;
    }

    public void setStartDatetime(LocalDateTime startDatetime) {
        this.startDatetime = startDatetime;
    }

    public LocalDateTime getEndDatetime() {
        return endDatetime;
    }

    public void setEndDatetime(LocalDateTime endDatetime) {
        this.endDatetime = endDatetime;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
}