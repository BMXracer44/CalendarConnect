package com.calendarconnect.backend.controller;

import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ GET USER BY USERNAME (THIS FIXES YOUR REACT ISSUE)
    @GetMapping("/{username}")
    public User getUser(@PathVariable String username) throws Exception {
        return userService.findByUsername(username);
    }
}