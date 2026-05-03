package com.calendarconnect.backend.dto;

import com.calendarconnect.backend.model.User;

public class UserSearchResponse {

  private final Integer id;
  private final String username;
  private final String firstName;
  private final String lastName;
  private final String profilePictureUrl;

  // 🔥 IMPORTANT FOR FRONTEND LOGIC
  private final String status; 
  // values: "none", "pending", "accepted"

  public UserSearchResponse(User user, String status) {
    this.id = user.getId();
    this.username = user.getUsername();
    this.firstName = user.getFirst_name();
    this.lastName = user.getLast_name();
    this.profilePictureUrl = user.getProfile_picture_url();
    this.status = status;
  }

  public Integer getId() { return id; }
  public String getUsername() { return username; }
  public String getFirstName() { return firstName; }
  public String getLastName() { return lastName; }
  public String getProfilePictureUrl() { return profilePictureUrl; }

  public String getStatus() { return status; }
}