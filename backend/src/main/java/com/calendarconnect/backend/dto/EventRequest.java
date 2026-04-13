package com.calendarconnect.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RegisterRequest {

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

  @JsonProperty("id")
  private String id;

  @JsonProperty("event_id")
  private String event_id;

  @JsonProperty("title")
  private String title;

  @JsonProperty("description")
  private String description;

  @JsonProperty("location")
  private String location;

  @JsonProperty("start_datetime")
  private String start_datetime;

  @JsonProperty("end_datetime")
  private String end_datetime;

  @JsonProperty("is_public")
  private String is_public;

  @JsonProperty("created_at")
  private String created_at;

  @JsonProperty("updated_at")
  private String updated_at;

  // Constructors
  public AddEvent() {
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