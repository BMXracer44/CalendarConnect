package com.calendarconnect.backend.controller;

import java.util.List;
import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.service.FriendService;
import com.calendarconnect.backend.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import com.calendarconnect.backend.model.FriendRequest;
import com.calendarconnect.backend.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin (origins = "http://localhost:3000")
public class FriendController{

    @Autowired
    private FriendService friendService;

    //add friend 
    @PostMapping ("/accept")
     public ResponseEntity<ApiResponse<?>> acceptFriend(@RequestBody FriendRequest request){
      try{
          friendService.acceptFriend(request);
        return ResponseEntity.ok(ApiResponse.success("This User is now your friend", null, 200);

      } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ApiResponse<>(false, e.getMessage(), null, 400));
      }
     }//end accept

     //reject friend
     @PostMapping ("/reject")
     public ResponseEntity<ApiResponse<?>> rejectFriend(@RequestBody FriendRequest request){

    try{         
        friendService.rejectFriend(request);
        return ResponseEntity.ok(ApiResponse.success("You have rejected this User");
        
    } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ApiResponse<>(false, e.getMessage(), null, 400));
      }
     }

    //edit friend
     @PostMapping("/edit")
    public ResponseEntity<ApiResponse<?>> editFriend(@RequestBody FriendRequest request){
        friendService.edit(request);
        return ResponseEntity.ok(ApiResponse.success("Friend profile updated");
    }
    //delete friend 
    @PostMapping ("/delete")
    public ResponseEntity<ApiResponse<?>> deleteFriend(@RequestBody FriendRequest request){

    try{
        friendService.deleteFriend(request);
        return ResponseEntity.ok(ApiResponse.success("You have removed this Friend", null, 200);
       
    }catch (Exception e) {
          return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ApiResponse<>(false, e.getMessage(), null, 400));
      }
    }

    //Get all Friends
    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse<?>> list(){
        
    try{
        List<User> friends = friendService.getAllFriends();
        return ResponseEntity.ok(ApiResponse.success("Friends List", friends, 200);
        
    }catch (Exception e) {
          return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ApiResponse<>(false, e.getMessage(), null, 400));
      }
    }
}
