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
        .findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(
            from, to, to, from
        )
        .isPresent();

    if (exists) return;

    Friendship f = new Friendship();
    f.setRequesterId(from);
    f.setAddresseeId(to);
    f.setStatus(Friendship.Status.pending);

    friendshipRepository.save(f);
  }

  // ================= ACCEPT REQUEST (STEP 4) =================
  public void acceptRequest(int from, int to) {

    Friendship f = friendshipRepository
        .findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(
            from, to, to, from
        )
        .orElseThrow(() -> new RuntimeException("Request not found"));

    f.setStatus(Friendship.Status.accepted);
    friendshipRepository.save(f);
  }

  // ================= GET FRIENDS =================
  public List<UserSearchResponse> getFriends(int userId) {

    return friendshipRepository.findAll().stream()
        .filter(f ->
            (f.getRequesterId() == userId || f.getAddresseeId() == userId)
                && f.getStatus() == Friendship.Status.accepted
        )
        .map(f -> {
          int friendId = (f.getRequesterId() == userId)
              ? f.getAddresseeId()
              : f.getRequesterId();

          User user = userRepository.findById(friendId).orElseThrow();
          return new UserSearchResponse(user, "accepted");
        })
        .toList();
  }

  // ================= PENDING REQUESTS (STEP 4) =================
  public List<UserSearchResponse> getPendingRequests(int userId) {

    return friendshipRepository.findAll().stream()
        .filter(f ->
            f.getAddresseeId() == userId &&
            f.getStatus() == Friendship.Status.pending
        )
        .map(f -> {
          User user = userRepository.findById(f.getRequesterId())
              .orElseThrow();

          return new UserSearchResponse(user, "pending");
        })
        .toList();
  }
}