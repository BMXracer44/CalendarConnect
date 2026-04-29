package com.calendarconnect.backend.dto;

import com.calendarconnect.backend.model.User;

public class UserSearchResponse {

  private final Integer id;
  private final String username;
  private final String firstName;
  private final String lastName;
  private final String profilePictureUrl;
  private final String friendshipStatus;

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