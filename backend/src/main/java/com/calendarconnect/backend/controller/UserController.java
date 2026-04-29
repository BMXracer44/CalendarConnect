package com.calendarconnect.backend.controller;

import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // GET USER BY USERNAME (THIS FIXES THE REACT ISSUE)
    @GetMapping("/{username}")
    public User getUser(@PathVariable String username) throws Exception {
        return userService.findByUsername(username);
    }

    /**
     * Searches users using sql query
     */
    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String query) {
        return userService.searchUsers(query);
    }
}