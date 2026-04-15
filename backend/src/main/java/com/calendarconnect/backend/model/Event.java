package com.calendarconnect.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; 

    @Column(name = "creator_id", nullable = false)
    private Integer creatorId; 

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "LOCATION") 
    private String location;

    @Column(name = "start_datetime", nullable = false)
    private LocalDateTime startDatetime;

    @Column(name = "end_datetime", nullable = false)
    private LocalDateTime endDatetime;

    @Column(name = "is_public", nullable = false)
    private boolean isPublic;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Event(){
    }

    public Event(Integer creatorId, String title, String description, String location, 
                 LocalDateTime startDatetime, LocalDateTime endDatetime, boolean isPublic) {
        this.creatorId = creatorId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.startDatetime = startDatetime;
        this.endDatetime = endDatetime;
        this.isPublic = isPublic;
    }

    public Integer getId(){ 
      return id; 
    }

    public void setId(Integer id){ 
      this.id = id; 
    }

    public Integer getCreatorId(){ 
      return creatorId; 
    }

    public void setCreatorId(Integer creatorId){ 
      this.creatorId = creatorId; 
    }
    
    public String getTitle(){ 
      return title; 
    }
    
    public void setTitle(String title){ 
      this.title = title; 
    }
    
    public String getDescription(){ 
      return description; 
    }
    
    public void setDescription(String description){ 
      this.description = description; 
    }
    
    public String getLocation(){ 
      return location; 
    }
    
    public void setLocation(String location){ 
      this.location = location; 
    }
    
    public LocalDateTime getStartDatetime(){ 
      return startDatetime; 
    }
    
    public void setStartDatetime(LocalDateTime startDatetime){ 
      this.startDatetime = startDatetime; 
    }
    
    public LocalDateTime getEndDatetime(){ 
      return endDatetime; 
    }
    
    public void setEndDatetime(LocalDateTime endDatetime){ 
      this.endDatetime = endDatetime; 
    }
    
    public boolean isPublic(){ 
      return isPublic; 
    }
    
    public void setPublic(boolean isPublic){ 
      this.isPublic = isPublic; 
    }
    
    public LocalDateTime getCreatedAt(){ 
      return createdAt; 
    }
    
    public void setCreatedAt(LocalDateTime createdAt){
      this.createdAt = createdAt; 
    }
    
    public LocalDateTime getUpdatedAt(){ 
      return updatedAt; 
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt){ 
      this.updatedAt = updatedAt; 
    }
}