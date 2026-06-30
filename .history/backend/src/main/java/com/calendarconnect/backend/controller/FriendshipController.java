package com.calendarconnect.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.calendarconnect.backend.service.FriendshipService;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "*")
public class FriendshipController {

  @Autowired
  private FriendshipService friendshipService;

  @PostMapping("/request")
  public void sendRequest(@RequestParam int from, @RequestParam int to) {
    friendshipService.sendRequest(from, to);
  }
}