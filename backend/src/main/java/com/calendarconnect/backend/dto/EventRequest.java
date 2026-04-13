package com.calendarconnect.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EventRequest {

  private String id;
  private String event_id;
  private String title;
  private String description;
  private String location;
  private String start_datetime;
  private String end_datetime;
  private boolean is_public;
  private String created_at;
  private String updated_at;

  // Constructors
  public EventRequest() {
  }

  // Getters and Setters
  public String getId() {
    return id;
  }

  public void setEventId(String event_id) {
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

  public void setLocation(String location) {
    this.location = location;
  }

  public String getStartDateTime() {
    return start_datetime;
  }

  public void setStartDateTime(String start_datetime) {
    this.start_datetime = start_datetime;
  }

  public String getEndDateTime() {
    return end_datetime;
  }

  public void setIsPublic(boolean is_public) {
    this.is_public = is_public;
  }

  public String getCreatedAt() {
    return created_at;
  }

  public void setCreatedAt(String created_at) {
    this.created_at = created_at;
  }

  public String getUpdatedAt() {
    return updated_at;
  }

  public void setUpdatedAt(String updated_at) {
    this.updated_at = updated_at;
  }

}