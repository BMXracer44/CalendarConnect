package com.calendarconnect.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.calendarconnect.backend.dto.UserSearchResponse;
import com.calendarconnect.backend.service.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

  @Autowired
  private UserService userService;

  @GetMapping("/search")
  public List<UserSearchResponse> searchUsers(
      @RequestParam String query,
      @RequestParam int currentUserId
  ) {
    return userService.searchUsers(query, currentUserId);
  }
  @GetMapping("/{username}")
public Object getUserProfile(@PathVariable String username) {
    return userService.getUserByUsername(username);
}
}