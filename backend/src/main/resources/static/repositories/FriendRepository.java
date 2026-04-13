package com.calendarconnect.backend.repository;

import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.model.Friends;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<Friend, Long> {

    // Find all friends for a user
    Optional<Friend> findByUser(User user);

    // Optional: find by friend relationship
    Optional<Friend> findByFriend(User friend);
}
