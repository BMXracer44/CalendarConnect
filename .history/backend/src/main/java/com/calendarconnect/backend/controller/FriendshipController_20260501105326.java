package com.calendarconnect.backend.controller;

import com.calendarconnect.backend.dto.FriendRequestDto;
import com.calendarconnect.backend.dto.UserSearchResponse;
import com.calendarconnect.backend.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "*")
public class FriendshipController {

  @Autowired
  private FriendshipService friendshipService;

  // ✅ Send friend request
  @PostMapping("/add")
  public void sendRequest(@RequestBody FriendRequestDto dto) {
    friendshipService.sendRequest(dto.getFrom(), dto.getTo());
  }

  // ✅ Get friend list
  @GetMapping("/{userId}")
  public List<UserSearchResponse> getFriends(@PathVariable int userId) {
    return friendshipService.getFriends(userId);
  }
}