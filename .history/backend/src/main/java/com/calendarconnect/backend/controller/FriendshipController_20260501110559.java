package com.calendarconnect.backend.controller;

import com.calendarconnect.backend.dto.UserSearchResponse;
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

  // ================= SEND FRIEND REQUEST =================
  @PostMapping("/add")
  public void sendRequest(
      @RequestParam int from,
      @RequestParam int to
  ) {
    friendshipService.sendRequest(from, to);
  }

  // ================= ACCEPT FRIEND REQUEST =================
  @PostMapping("/accept")
  public void acceptRequest(
      @RequestParam int from,
      @RequestParam int to
  ) {
    friendshipService.acceptRequest(from, to);
  }

  // ================= GET FRIEND LIST =================
  @GetMapping("/{userId}")
  public List<UserSearchResponse> getFriends(
      @PathVariable int userId
  ) {
    return friendshipService.getFriends(userId);
  }

  // ================= GET PENDING REQUESTS (OPTIONAL BUT USEFUL) =================
  @GetMapping("/pending/{userId}")
  public List<UserSearchResponse> getPendingRequests(
      @PathVariable int userId
  ) {
    return friendshipService.getPendingRequests(userId);
  }
}