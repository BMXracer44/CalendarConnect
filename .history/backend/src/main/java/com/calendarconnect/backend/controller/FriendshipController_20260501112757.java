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

  // SEND REQUEST
  @PostMapping("/add")
  public void add(@RequestParam int from, @RequestParam int to) {
    friendshipService.sendRequest(from, to);
  }

  // ACCEPT
  @PostMapping("/accept")
  public void accept(@RequestParam int from, @RequestParam int to) {
    friendshipService.acceptRequest(from, to);
  }

  // DECLINE
  @PostMapping("/decline")
  public void decline(@RequestParam int from, @RequestParam int to) {
    friendshipService.declineRequest(from, to);
  }

  // FRIENDS LIST
  @GetMapping("/{userId}")
  public List<UserSearchResponse> friends(@PathVariable int userId) {
    return friendshipService.getFriends(userId);
  }

  // PENDING REQUESTS (NOTIFICATIONS)
  @GetMapping("/requests/{userId}")
  public List<UserSearchResponse> requests(@PathVariable int userId) {
    return friendshipService.getPendingRequests(userId);
  }
}