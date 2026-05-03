package com.calendarconnect.backend.dto;

public class FriendRequestDTO {

  private Integer id;
  private Integer friendId;
  private String username;

  public FriendRequestDTO(Integer id, Integer friendId, String username) {
    this.id = id;
    this.friendId = friendId;
    this.username = username;
  }

  public Integer getId() { return id; }
  public Integer getFriendId() { return friendId; }
  public String getUsername() { return username; }
}