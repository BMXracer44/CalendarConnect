package com.calendarconnect.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.calendarconnect.backend.dto.ApiResponse;
import com.calendarconnect.backend.dto.RegisterRequest;
import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.service.UserService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {

  @Autowired
  private UserService userService;

  /**
   * Register endpoint
   */
  @PostMapping("/register")
  public ResponseEntity<ApiResponse<?>> register(@RequestBody RegisterRequest request) {
    try {
      User user = userService.registerUser(request);

      Map<String, Object> data = new HashMap<>();
      data.put("id", user.getId());
      data.put("username", user.getUsername());
      data.put("email", user.getEmail());
      data.put("first_name", user.getFirst_name());
      data.put("last_name", user.getLast_name());

      return ResponseEntity.status(HttpStatus.CREATED)
          .body(ApiResponse.success("User registered successfully", data, 201));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ApiResponse<>(false, e.getMessage(), null, 400));
    }
  }

  /**
   * Login endpoint
   */
  @PostMapping("/login")
  public ResponseEntity<ApiResponse<?>> login(@RequestBody Map<String, String> request) {
    try {
      String username = request.get("username");
      String password = request.get("password");

      if (username == null || password == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(new ApiResponse<>(false, "Username and password required", null, 400));
      }

      User user = userService.findByUsername(username);

      if (!userService.verifyPassword(password, user.getPassword_hash())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ApiResponse<>(false, "Invalid username and/or password", null, 401));
      }

      Map<String, Object> data = new HashMap<>();
      data.put("id", user.getId());
      data.put("username", user.getUsername());
      data.put("email", user.getEmail());
      data.put("token", "jwt-token-placeholder-" + user.getId());

      return ResponseEntity.ok(ApiResponse.success("Login successful", data, 200));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new ApiResponse<>(false, "Invalid username and/or password", null, 401));
    }
  }
}
