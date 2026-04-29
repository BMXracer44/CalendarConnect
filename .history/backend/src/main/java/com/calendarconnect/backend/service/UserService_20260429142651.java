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

  // ================= REGISTER USER =================
  public User registerUser(RegisterRequest request) throws Exception {

    if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
      throw new Exception("Username cannot be empty");
    }

    if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
      throw new Exception("Email cannot be empty");
    }

    if (request.getPassword() == null || request.getPassword().length() < 6) {
      throw new Exception("Password must be at least 6 characters");
    }

    if (userRepository.existsByUsername(request.getUsername())) {
      throw new Exception("Username already exists");
    }

    if (userRepository.existsByEmail(request.getEmail())) {
      throw new Exception("Email already exists");
    }

    LocalDate birthdate;
    try {
      birthdate = LocalDate.parse(request.getBirthdate(), DateTimeFormatter.ISO_DATE);
    } catch (Exception e) {
      throw new Exception("Invalid date format. Use YYYY-MM-DD");
    }

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

  // ================= SEARCH USERS =================
  public List<UserSearchResponse> searchUsers(String query, int currentUserId) {

    List<User> users = userRepository.searchUsers(query);

    return users.stream().map(user -> {

      String status = "none";

      Optional<Friendship> f =
          friendshipRepository.findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(
              currentUserId,
              user.getId(),
              user.getId(),
              currentUserId
          );

      if (f.isPresent()) {
        status = f.get().getStatus().name();
      }

      return new UserSearchResponse(user, status);

    }).toList();
  }

  // ================= GET PROFILE BY USERNAME =================
  public User findByUsername(String username) throws Exception {
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new Exception("User not found"));
  }

  // ================= VERIFY PASSWORD =================
  public boolean verifyPassword(String rawPassword, String encodedPassword) {
    return passwordEncoder.matches(rawPassword, encodedPassword);
  }

  // ================= OPTIONAL: UPDATE USER (IMPORTANT) =================
  public User updateUser(String username, User updatedUser) throws Exception {

    User existingUser = userRepository.findByUsername(username)
        .orElseThrow(() -> new Exception("User not found"));

    if (updatedUser.getEmail() != null)
      existingUser.setEmail(updatedUser.getEmail());

    if (updatedUser.getFirst_name() != null)
      existingUser.setFirst_name(updatedUser.getFirst_name());

    if (updatedUser.getLast_name() != null)
      existingUser.setLast_name(updatedUser.getLast_name());

    if (updatedUser.getBirthdate() != null)
      existingUser.setBirthdate(updatedUser.getBirthdate());

    if (updatedUser.getPhone_number() != null)
      existingUser.setPhone_number(updatedUser.getPhone_number());

    if (updatedUser.getBio() != null)
      existingUser.setBio(updatedUser.getBio());

    if (updatedUser.getProfile_picture_url() != null)
      existingUser.setProfile_picture_url(updatedUser.getProfile_picture_url());

    return userRepository.save(existingUser);
  }
}