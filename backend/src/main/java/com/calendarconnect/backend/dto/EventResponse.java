package com.calendarconnect.backend.dto;

import com.calendarconnect.backend.model.Event;
import java.time.LocalDateTime;

public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private Boolean isPublic;
    private Long userId;
    private List friendsAt;
    

    public EventResponse() {}

    public EventResponse(Long id, String title, String description,
                         String location, LocalDateTime startDatetime,
                         LocalDateTime endDatetime, Boolean isPublic,
                         Long userId, List friendsAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.startDatetime = startDatetime;
        this.endDatetime = endDatetime;
        this.isPublic = isPublic;
        this.userId = userId;
        this.friendsAt = friendsAt;
    }

    // =========================
    // FIXED MAPPING METHOD
    // =========================
    public static EventResponse fromEntity(Event event) {
        return new EventResponse(
            event.getId(),
            event.getTitle(),
            event.getDescription(),
            event.getLocation(),
            event.getStartDatetime(),
            event.getEndDatetime(),
            event.getIsPublic(),
            event.getCreatorId(),
            evet.getFriendsAt()// ✅ FIXED HERE
        );
    }

    // getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public LocalDateTime getStartDatetime() { return startDatetime; }
    public LocalDateTime getEndDatetime() { return endDatetime; }
    public Boolean getIsPublic() { return isPublic; }
    public Long getUserId() { return userId; }
    public List getFriendsAt() { return friendsAt; }

    // setters
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setLocation(String location) { this.location = location; }
    public void setStartDatetime(LocalDateTime startDatetime) { this.startDatetime = startDatetime; }
    public void setEndDatetime(LocalDateTime endDatetime) { this.endDatetime = endDatetime; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setFriendsAt(List friendsAt) { this.friendsAt = friendsAt; }
}
