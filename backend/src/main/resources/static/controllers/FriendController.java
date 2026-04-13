import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/Friend")
@CrossOrigin
public class FriendController{

    @Autowired
    private FriendService friendService;

    //add friend 
    @PostMapping ("/accept")
     public String acceptFriend(@RequestBody Friend request){
        friendService.acceptFriend(request);
        return "This User is now your friend";
     }

     //reject friend
     @PostMapping ("/reject")
     public String rejectFriend(@RequestBody Friend request){
        friendService.rejectFriend(request);
        return "You have rejected this User";

     }

    //edit friend
     @PostMapping("/edit")
    public String editFriend(@RequestBody Friend request){
        friendService.edit(request);
        return "Friend profile updated";
    }
    //delete friend 
    @PostMapping ("/delete")
    public String deleteFriend(@RequestBody Friend request){
        friendService.deleteFriend(request);
         return "You have removed this Friend";
    }

    //Get all Friends
    @GetMapping("/getAll")
    public List<User> list(){
        return friendService.getAllFriends();
    }
}
