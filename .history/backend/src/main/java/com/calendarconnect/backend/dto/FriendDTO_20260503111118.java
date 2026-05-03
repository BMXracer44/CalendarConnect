package com.calendarconnect.backend.dto;

public class FriendDTO {

  private Integer userId;
  private String username;

  public FriendDTO(Integer userId, String username) {
    this.userId = userId;
    this.username = username;
  }

  public Integer getUserId() { return userId; }
  public String getUsername() { return username; }
}