package com.calendarconnect.backend.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.calendarconnect.backend.dto.RegisterRequest;
import com.calendarconnect.backend.dto.UserSearchResponse;
import com.calendarconnect.backend.model.Friendship;
import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.repository.FriendshipRepository;
import com.calendarconnect.backend.repository.UserRepository;

@Service
public class UserService {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private FriendshipRepository friendshipRepository;

  private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

  public User registerUser(RegisterRequest request) throws Exception {
    // Validate input
    if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
      throw new Exception("Username cannot be empty");
    }
    if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
      throw new Exception("Email cannot be empty");
    }
    if (request.getPassword() == null || request.getPassword().length() < 6) {
      throw new Exception("Password must be at least 6 characters");
    }

    // Check if username already exists
    if (userRepository.existsByUsername(request.getUsername())) {
      throw new Exception("Username already exists");
    }

    // Check if email already exists
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new Exception("Email already exists");
    }

    // Parse birthdate
    LocalDate birthdate;
    try {
      DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
      birthdate = LocalDate.parse(request.getBirthdate(), formatter);
    } catch (Exception e) {
      throw new Exception("Invalid date format. Use YYYY-MM-DD");
    }

    // Create new user
    User user = new User();
    user.setUsername(request.getUsername());
    user.setEmail(request.getEmail());
    user.setPassword_hash(passwordEncoder.encode(request.getPassword()));
    user.setFirst_name(request.getFirstName());
    user.setLast_name(request.getLastName());
    user.setBirthdate(birthdate);
    user.setPhone_number(request.getPhoneNumber());
    user.setBio(request.getBio());
    user.setProfile_picture_url(request.getProfilePictureUrl());

    return userRepository.save(user);
  }

  public List<UserSearchResponse> searchUsers(String query, int currentUserId) {

    List<User> users = userRepository.searchUsers(query);

    return users.stream().map(user -> {

      String status = "none";

      Optional<Friendship> f =
          friendshipRepository.findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(
              currentUserId, user.getId(),
              user.getId(), currentUserId
          );

      if (f.isPresent()) {
        status = f.get().getStatus().name();
      }

      return new UserSearchResponse(user, status);

    }).toList();
  }

 public User findByUsername(String username) throws Exception {
  return userRepository.findByUsername(username)
      .orElseThrow(() -> new Exception("User not found"));
}

  /**
   * Verify password
   */
  public boolean verifyPassword(String rawPassword, String encodedPassword) {
    return passwordEncoder.matches(rawPassword, encodedPassword);
  }
}