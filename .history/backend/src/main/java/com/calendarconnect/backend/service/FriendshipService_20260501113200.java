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

    if (from == to) return;

    boolean exists = friendshipRepository
        .findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(from, to, to, from)
        .isPresent();

    if (exists) return;

    Friendship f = new Friendship();
    f.setRequesterId(from);
    f.setAddresseeId(to);
    f.setStatus(Friendship.Status.pending);

    friendshipRepository.save(f);
  }

  // ================= ACCEPT =================
  public void acceptRequest(int from, int to) {

    Friendship f = friendshipRepository
        .findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(from, to, to, from)
        .orElseThrow();

    f.setStatus(Friendship.Status.accepted);
    friendshipRepository.save(f);
  }

  // ================= DECLINE =================
  public void declineRequest(int from, int to) {

    Friendship f = friendshipRepository
        .findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(from, to, to, from)
        .orElseThrow();

    f.setStatus(Friendship.Status.declined);
    friendshipRepository.save(f);
  }

  // ================= FRIENDS LIST =================
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

  // ================= PENDING REQUESTS =================
  public List<UserSearchResponse> getPendingRequests(int userId) {

    return friendshipRepository.findAll().stream()
        .filter(f ->
            f.getAddresseeId() == userId &&
            f.getStatus() == Friendship.Status.pending
        )
        .map(f -> {
          User requester = userRepository.findById(f.getRequesterId()).orElseThrow();
          return new UserSearchResponse(requester, "pending");
        })
        .toList();
  }
}