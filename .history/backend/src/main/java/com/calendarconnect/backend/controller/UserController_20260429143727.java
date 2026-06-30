package com.calendarconnect.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.calendarconnect.backend.dto.UserSearchResponse;
import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.service.UserService;
import com.calendarconnect.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

  @Autowired
  private UserService userService;

  @Autowired
  private UserRepository userRepository;

  // ================= SEARCH USERS =================
  @GetMapping("/search")
  public List<UserSearchResponse> searchUsers(
      @RequestParam String query,
      @RequestParam int currentUserId
  ) {
    return userService.searchUsers(query, currentUserId);
  }

  // ================= GET USER PROFILE =================
  @GetMapping("/{username}")
  public User getUserByUsername(@PathVariable String username) throws Exception {
    return userService.findByUsername(username);
  }

  // ================= UPDATE USER PROFILE (FIXED) =================
  @PutMapping("/update/{username}")
  public User updateUser(
      @PathVariable String username,
      @RequestBody User updatedUser
  ) throws Exception {

    User existingUser = userService.findByUsername(username);

    // Only update fields safely
    existingUser.setEmail(updatedUser.getEmail());
    existingUser.setFirst_name(updatedUser.getFirst_name());
    existingUser.setLast_name(updatedUser.getLast_name());
    existingUser.setBirthdate(updatedUser.getBirthdate());
    existingUser.setPhone_number(updatedUser.getPhone_number());
    existingUser.setBio(updatedUser.getBio());
    existingUser.setProfile_picture_url(updatedUser.getProfile_picture_url());

    return userRepository.save(existingUser);
  }
}