package com.calendarconnect.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer event_id;

  @Column(nullable = false, unique = false)
  private String title;

  @Column(nullable = true)
  private String description;

  @Column(nullable = true)
  private String location;

  @Column(nullable = false)
  private LocalDate start_datetime;

  @Column(nullable = false)
  private LocalDate end_datetime;

  @Column(nullable = false)
  private boolean is_public;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime created_at;

  @UpdateTimestamp
  @Column(nullable = false)
  private LocalDateTime updated_at;

  // Constructors
  public Event() {
  }

  public Event(String event_id, String title, String description,
      String location, LocalDate start_datetime, LocalDate end_datetime,
      boolean is_public) {
    this.event_id = EventId;
    this.title = title;
    this.description = description;
    this.location = location;
    this.start_datetime = start_datetime;
    this.end_datetime = end_datetime;
    this.is_public = is_public;
  }

  // Getters and Setters
  public Integer getId() {
    return id;
  }

  public String getEventId() {
    return event_id;
  }

  public void setEventId(String EventId) {
    this.event_id = event_id;
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

  public void setStartDateTime(String start_datetime) {
    this.start_datetime = start_datetime;
  }

  public LocalDate getStartDateTime() {
    return start_datetime;
  }

  public void setEndDateTime(String end_datetime) {
    this.end_datetime = end_datetime;
  }

  public LocalDate getEndDateTime() {
    return end_datetime;
  }

  public boolean getIsPublic() {
    return is_public;
  }

  public void setIsPublic(String is_public) {
    this.is_public = is_public;
  }

  public LocalDateTime getCreated_at() {
    return created_at;
  }

  public void setCreated_at(LocalDateTime created_at) {
    this.created_at = created_at;
  }

  public LocalDateTime getUpdated_at() {
    return updated_at;
  }

  public void setUpdated_at(LocalDateTime updated_at) {
    this.updated_at = updated_at;
  }
}
