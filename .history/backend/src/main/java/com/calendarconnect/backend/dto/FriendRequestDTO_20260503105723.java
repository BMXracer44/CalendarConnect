package com.calendarconnect.backend.dto;

public class FriendRequestDTO {

  private Integer id;
  private Integer requesterId;
  private String username;

  public FriendRequestDTO(Integer id, Integer requesterId, String username) {
    this.id = id;
    this.requesterId = requesterId;
    this.username = username;
  }

  public Integer getId() { return id; }
  public Integer getRequesterId() { return requesterId; }
  public String getUsername() { return username; }
}