package com.calendarconnect.backend.service;

import com.calendarconnect.backend.dto.UserSearchResponse;
import com.calendarconnect.backend.model.Friendship;
import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.repository.FriendshipRepository;
import com.calendarconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendshipService {

  @Autowired
  private FriendshipRepository friendshipRepository;

  @Autowired
  private UserRepository userRepository;

  // ================= SEND REQUEST =================
  public void sendRequest(int from, int to) {

    boolean exists = friendshipRepository
        .findByRequesterIdAndAddresseeId(from, to)
        .isPresent();

    if (exists) {
      throw new RuntimeException("Request already exists");
    }

    Friendship f = new Friendship();
    f.setRequesterId(from);
    f.setAddresseeId(to);
    f.setStatus(Friendship.Status.pending);

    friendshipRepository.save(f);
  }

  // ================= GET FRIENDS =================
  public List<UserSearchResponse> getFriends(int userId) {

    List<Friendship> friendships = friendshipRepository.findAll();

    return friendships.stream()
        .filter(f ->
            (f.getRequesterId() == userId || f.getAddresseeId() == userId)
                && f.getStatus() == Friendship.Status.accepted
        )
        .map(f -> {

          int friendId = (f.getRequesterId() == userId)
              ? f.getAddresseeId()
              : f.getRequesterId();

          User friend = userRepository.findById(friendId)
              .orElseThrow();

          return new UserSearchResponse(friend, "accepted");
        })
        .toList();
  }
}