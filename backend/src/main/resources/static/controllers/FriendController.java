package com.calendarconnect.backend.controller;

import java.util.List;
import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.service.FriendService;
import com.calendarconnect.backend.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import com.calendarconnect.backend.model.Friendship;
import com.calendarconnect.backend.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin (origins = "http://localhost:3000")
public class FriendController{

    @Autowired
    private FriendService friendService;
    
    //add friend 
    @PostMapping ("friends/{id}/accept")
     public ResponseEntity<ApiResponse<?>> acceptFriend(@PathVariable Integer id){
      try{
          friendService.acceptFriend(id);
        return ResponseEntity.ok(ApiResponse.success("This User is now your friend", null, 200));

      } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ApiResponse<>(false, e.getMessage(), null, 400));
      }
     }//end accept

     //reject friend
     @PostMapping ("friends/{id}/reject")
     public ResponseEntity<ApiResponse<?>> rejectFriend(@PathVariable Integer id){

    try{         
        friendService.rejectFriend(id);
        return ResponseEntity.ok(ApiResponse.success("You have rejected this User"));
        
    } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ApiResponse<>(false, e.getMessage(), null, 400));
      }
     }

    //edit friend
     @PutMapping("friends/{id}")
    public ResponseEntity<ApiResponse<?>> editFriend(@PathVariable Integer id, @RequestBody Friendships request){
        friendService.editFriend(id,request);
        return ResponseEntity.ok(ApiResponse.success("Friend profile updated"));
    }
    //delete friend 
    @DeleteMapping ("friends/{id}")
    public ResponseEntity<ApiResponse<?>> delete(@PathVariable Integer id){

    try{
        friendService.deleteFriend(id);
        return ResponseEntity.ok(ApiResponse.success("You have removed this Friend", null, 200));
       
    }catch (Exception e) {
          return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ApiResponse<>(false, e.getMessage(), null, 400));
      }
    }

    //Get all Friends
    @GetMapping("friends/{userId}")
    public ResponseEntity<ApiResponse<?>> list(@PathVariable Integer userId){
        
    try{
        List<User> friends = friendService.getAllFriends(userId);
        return ResponseEntity.ok(ApiResponse.success("Friends List", friends, 200));
        
    }catch (Exception e) {
          return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body(new ApiResponse<>(false, e.getMessage(), null, 400));
      }
    }
}
