package com.calendarconnect.backend.controller;

import com.calendarconnect.backend.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "*")
public class FriendshipController {

  @Autowired
  private FriendshipService friendshipService;

  // ================= ADD FRIEND =================
  @PostMapping("/add")
  public void sendRequest(
      @RequestParam int from,
      @RequestParam int to
  ) {
    friendshipService.sendRequest(from, to);
  }

  // ================= ACCEPT FRIEND =================
  @PostMapping("/accept")
  public void acceptRequest(
      @RequestParam int from,
      @RequestParam int to
  ) {
    friendshipService.acceptRequest(from, to);
  }
}