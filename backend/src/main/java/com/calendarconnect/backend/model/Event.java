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
  private LocalDateTime startDateTime;

  @Column(name = "end_datetime", nullable = false)
  private LocalDateTime endDateTime;

  @Column(name = "is_public", nullable = false)
  private boolean isPublic;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  // Constructors
  public Event() {
  }

  public Event(Integer creatorId, String title, String description, String location, 
                 LocalDateTime startDatetime, LocalDateTime endDatetime, boolean isPublic){
    this.creatorId = creatorId;
    this.title = title;
    this.description = description;
    this.location = location;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.isPublic = isPublic;
  }

  // Getters and Setters
  public Integer getId() {
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

  public void setLocation(String location){
    this.location = location;
  }

  public void setStartDateTime(String start_datetime) {
    this.start_datetime = start_datetime;
  }

  public LocalDateTime getStartDateTime() {
    return start_datetime;
  }

  public void setEndDateTime(String end_datetime) {
    this.end_datetime = end_datetime;
  }

  public LocalDateTime getEndDateTime() {
    return end_datetime;
  }

  public boolean isPublic() {
    return isPublic;
  }

  public void setPublic(String isPublic) {
    this.isPublic = isPublic;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdated_at(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
