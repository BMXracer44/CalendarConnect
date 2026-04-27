package com.calendarconnect.backend.service;
import com.calendarconnect.backend.dto.RegisterRequest;
import com.calendarconnect.backend.model.FriendRequest;
import com.calendarconnect.backend.repository.FriendRepository;
import com.calendarconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class FriendService {

  @Autowired
  private FriendRepository friendRepository;

  @Autowired
  private UserRepository userRepository;
  /**
   *Accept Friend request
   */
  public void acceptFriend(Integer friendshipId) throws Exception {
      
    Friendship friendship = friendRepository.findById(friendshipId);

    if (!friendship.existsById(friendshipId)) {
      throw new Exception("Friend request not found");
    }
    //update friend status
    friendship.setStatus(Friendship.Status.ACCEPTED);
    friendRepository.save(friendship);

    //update friend list for both users
    User requester = userRepository.findById(friendship.getRequester_id());
    User addressee = userRepository.findById(friendship.getAddressee_id());
    
    //add each other as friends
    requester.getFriends().add(addressee);
    addressee.getFriends().add(requester);
    
    //save updated users, transaction will ensure atomicity
    //userRepository.save(requester);
    //userRepository.save(addressee);
    
  }

   //*Reject Friend request
  public void rejectFriend(Integer friendshipId) throws Exception {
      
    Friendship friendship = friendRepository.findById(friendshipId);
    //check if friendship exists
    if (!friendship.existsById(friendshipId)) {
      throw new Exception("Friend request not found");
    }
  
    friendship.setStatus(Friendship.Status.REJECTED);
    friendRepository.remove(friendship);
    
  }

   //Delete Friend
   
  public void deleteFriend(Integer friendshipId) throws Exception {
      
    Friendship friendship = friendRepository.findById(friendshipId);

    //check if friendship exists
    if (!friendship.existsById(friendshipId)) {
      throw new Exception("Friend does not exist");
    } 

    //remove each other from friend lists
     User requester = userRepository.findById(friendship.getRequester_id())
     .orElseThrow(() -> new Exception("Requester not found"));

    User addressee = userRepository.findById(friendship.getAddressee_id())
    .orElseThrow(() -> new Exception("Addressee not found"));
    
    requster.getFriends().remove(addressee);
    addressee.getFriends().remove(requester);

     //update friend status to deleted
    friendship.setStatus(Friendship.Status.DELETED);
    friendRepository.delete(friendship);
  }

  //edit friend details
  public void editFriend(Integer friendshipId, String newUsername) throws Exception {
    Friendship friendship = friendRepository.findById(friendshipId);

    if (!friendship.existsById(friendshipId)) {
      throw new Exception("Friend not found");
    }
    //update friend details
    User friend = userRepository.findById(friendship.getAddressee_id());
    friend.setNickname(newUsername);
    userRepository.save(friend);
  }

   /**
   * Get all friends for a user
   */
  @Transactional(readOnly = true)
    public List<Friend> getAllFriends(Integer userId) throws Exception {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new Exception("User not found"));
        return friendRepository.findByUser(user)
            .orElseThrow(() -> new Exception("No friends found for this user"));
    }
  /**
   * Find friend by username
   */
    public Friend findFriendByUsername(String username) throws Exception {
        User friend = userRepository.findByUsername(username)
            .orElseThrow(() -> new Exception("Friend not found"));
        return friendRepository.findByFriend(friend)
            .orElseThrow(() -> new Exception("Friend relationship not found"));
  }

}
