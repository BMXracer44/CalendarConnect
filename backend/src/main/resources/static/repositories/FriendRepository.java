package com.calendarconnect.backend.repository;

import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.model.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Long> {

    // Find all accepted friends for a user
    Optional<Friend> findByUser(User user);

    //Find pending friend requests for a user
    List<Friend> findByUserAndStatus(User user, Friend.Status status);

    //Find friend by username
    Optional<Friend> findByUsername(String username);

    // Optional: find by friend relationship
    Optional<Friend> findByFriend(User friend);
    
    //Find by Id
    Optional<Friend> findById(Integer id);
}
