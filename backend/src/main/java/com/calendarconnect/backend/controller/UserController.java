package com.calendarconnect.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.calendarconnect.backend.dto.UserSearchResponse;
import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.repository.UserRepository;
import com.calendarconnect.backend.service.UserService;

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

  // ================= GET PROFILE =================
  @GetMapping("/{username}")
  public User getUserByUsername(@PathVariable String username) throws Exception {
    return userService.findByUsername(username);
  }

  // ================= UPDATE PROFILE =================
  @PutMapping("/update/{username}")
  public User updateUser(
      @PathVariable String username,
      @RequestBody User updatedUser
  ) throws Exception {

    User existingUser = userService.findByUsername(username);

    existingUser.setEmail(updatedUser.getEmail());
    existingUser.setFirst_name(updatedUser.getFirst_name());
    existingUser.setLast_name(updatedUser.getLast_name());
    existingUser.setBirthdate(updatedUser.getBirthdate());
    existingUser.setPhone_number(updatedUser.getPhone_number());
    existingUser.setBio(updatedUser.getBio());

    if (updatedUser.getProfile_picture_url() != null &&
        !updatedUser.getProfile_picture_url().isEmpty()) {
      existingUser.setProfile_picture_url(updatedUser.getProfile_picture_url());
    }

    return userRepository.save(existingUser);
  }

  @PostMapping("/upload-pfp/{username}")
    public ResponseEntity<?> uploadProfilePicture(@PathVariable String username, @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        try {
            // 1. Create an "uploads" folder on your backend server
            java.nio.file.Path uploadPath = java.nio.file.Paths.get("uploads");
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }

            // 2. Clean the file name and save it
            String filename = username + "_" + file.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
            java.nio.file.Path filePath = uploadPath.resolve(filename);
            java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // 3. Hand the permanent URL back to React!
            String fileUrl = "/uploads/" + filename;
            return ResponseEntity.ok(java.util.Map.of("url", fileUrl));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Could not upload file"));
        }
    }
}