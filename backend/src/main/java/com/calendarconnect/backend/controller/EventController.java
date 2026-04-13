package com.calendarconnect.backend.controller;

import com.calendarconnect.backend.dto.ApiResponse;
import com.calendarconnect.backend.dto.RegisterRequest;
import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

  @Autowired
  private EventService eventService;

  /**
   * Add event endpoint
   */
  @PostMapping("/add")
  public ResponseEntity<ApiResponse<?>> addEvent(@RequestBody RegisterRequest request) {
    try {
      Event event = eventService.addEvent(request);
      //id, event_id, title, description, location, start_datetime, end_datetime, is_public, created_at, updated_at

      Map<String, Object> data = new HashMap<>();
      data.put("event_id", event.getEventId());
      data.put("title", event.getTitle());
      data.put("description", event.getDescription());
      data.put("location", event.getLocation());
      data.put("start_datetime", event.getStartDateTime());
      data.put("end_datetime", event.getEndDateTime());
      data.put("is_public", event.getIsPublic());
      data.put("created_at", event.getCreated_at());
      data.put("updated_at", event.getUpdatedAt());

      return ResponseEntity.status(HttpStatus.CREATED)
          .body(ApiResponse.success("Event added successfully", data, 201));
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ApiResponse<>(false, e.getMessage(), null, 400));
    }
  }

  /**
   * Delete event endpoint
   */
  @PostMapping("/delete") //Needs lots of work
  public ResponseEntity<ApiResponse<?>> deleteEvent(@RequestBody Map<String, String> request) {
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
