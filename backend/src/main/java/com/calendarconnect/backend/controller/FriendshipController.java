package com.calendarconnect.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.calendarconnect.backend.dto.FriendRequestDTO;
import com.calendarconnect.backend.service.FriendshipService;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "*")
public class FriendshipController {

  @Autowired
  private FriendshipService friendshipService;

  // ================= SEND =================
  @PostMapping("/add")
  public void sendRequest(
      @RequestParam int from,
      @RequestParam int to
  ) {
    friendshipService.sendRequest(from, to);
  }

  // ================= ACCEPT =================
  @PostMapping("/accept")
  public void acceptRequest(
      @RequestParam int from,
      @RequestParam int to
  ) {
    friendshipService.acceptRequest(from, to);
  }

  // ================= GET REQUESTS =================
  @GetMapping("/requests/{userId}")
  public List<FriendRequestDTO> getRequests(@PathVariable int userId) {
    return friendshipService.getPendingRequests(userId);
  }
  @GetMapping("/{userId}")
  public List<FriendRequestDTO> getFriends(@PathVariable int userId) {
    return friendshipService.getFriends(userId);
  }
  @GetMapping("/requests/sent/{userId}")
  public List<FriendRequestDTO> getSentRequests(@PathVariable int userId) {
    return friendshipService.getSentRequests(userId);
  }
}