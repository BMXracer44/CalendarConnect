package com.calendarconnect.backend.controller;

import com.calendarconnect.backend.dto.FriendRequestDTO;
import com.calendarconnect.backend.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "http://localhost:3000")
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
  @DeleteMapping("/remove")
  public void removeFriend(
      @RequestParam int userId,
      @RequestParam int friendId
  ) {
    friendshipService.removeFriend(userId, friendId);
  }
}