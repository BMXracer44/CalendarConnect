package com.calendarconnect.backend.controller;

import java.util.List;
import com.calendarconnect.backend.model.FriendRequest;
import com.calendarconnect.backend.dto.RegisterRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/FriendRequest")
@CrossOrigin (origins = "https://localhost:3000")
public class FriendController{

    @Autowired
    private FriendService friendService;

    //add friend 
    @PostMapping ("/accept")
     public String acceptFriend(@RequestBody FriendRequest request){
        friendService.acceptFriend(request);
        return "This User is now your friend";
     }

     //reject friend
     @PostMapping ("/reject")
     public String rejectFriend(@RequestBody FriendRequest request){
        friendService.rejectFriend(request);
        return "You have rejected this User";

     }

    //edit friend
     @PostMapping("/edit")
    public String editFriend(@RequestBody FriendRequest request){
        friendService.edit(request);
        return "Friend profile updated";
    }
    //delete friend 
    @PostMapping ("/delete")
    public String deleteFriend(@RequestBody FriendRequest request){
        friendService.deleteFriend(request);
         return "You have removed this Friend";
    }

    //Get all Friends
    @GetMapping("/getAll")
    public List<User> list(){
        return friendService.getAllFriends();
    }
}
