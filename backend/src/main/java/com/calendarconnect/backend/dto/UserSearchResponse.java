package com.calendarconnect.backend.dto;

import com.calendarconnect.backend.model.User;

public class UserSearchResponse {

  private Integer id;
  private String username;
  private String firstName;
  private String lastName;
  private String profilePictureUrl;
  private String friendshipStatus;

  public UserSearchResponse(User user, String friendshipStatus) {
    this.id = user.getId();
    this.username = user.getUsername();
    this.firstName = user.getFirst_name();
    this.lastName = user.getLast_name();
    this.profilePictureUrl = user.getProfile_picture_url();
    this.friendshipStatus = friendshipStatus;
  }

  // getters
  public Integer getId() { return id; }
  public String getUsername() { return username; }
  public String getFirstName() { return firstName; }
  public String getLastName() { return lastName; }
  public String getProfilePictureUrl() { return profilePictureUrl; }
  public String getFriendshipStatus() { return friendshipStatus; }
}