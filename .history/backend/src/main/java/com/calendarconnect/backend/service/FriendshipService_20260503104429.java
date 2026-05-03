package com.calendarconnect.backend.service;

import com.calendarconnect.backend.dto.FriendRequestDTO;
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

  Friendship existing = friendshipRepository
      .findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(
          from, to, to, from
      )
      .orElse(null);

  // ✅ If no relationship exists → allow request
  if (existing == null) {
    Friendship f = new Friendship();
    f.setRequesterId(from);
    f.setAddresseeId(to);
    f.setStatus(Friendship.Status.pending);

    friendshipRepository.save(f);
    return;
  }

  // ❌ If already friends → block
  if (existing.getStatus() == Friendship.Status.accepted) {
    return;
  }

  // ❌ If already pending → block
  if (existing.getStatus() == Friendship.Status.pending) {
    return;
  }

  // 🔥 If declined → allow re-request
  if (existing.getStatus() == Friendship.Status.declined) {
    existing.setRequesterId(from);
    existing.setAddresseeId(to);
    existing.setStatus(Friendship.Status.pending);
    friendshipRepository.save(existing);
  }
}
  // ================= ACCEPT REQUEST =================
  public void acceptRequest(int from, int to) {

    Friendship f = friendshipRepository
        .findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(from, to, to, from)
        .orElseThrow(() -> new RuntimeException("Request not found"));

    f.setStatus(Friendship.Status.accepted);

    friendshipRepository.save(f);
  }

  // ================= GET FRIENDS =================
  public List<FriendRequestDTO> getFriends(int userId) {

    return friendshipRepository.findAll().stream()
        .filter(f ->
            f.getStatus() == Friendship.Status.accepted &&
            f.getRequesterId() != null &&
            f.getAddresseeId() != null &&
            (f.getRequesterId().equals(userId) || f.getAddresseeId().equals(userId))
        )
        .map(f -> {

          int friendId = f.getRequesterId().equals(userId)
              ? f.getAddresseeId()
              : f.getRequesterId();

          User u = userRepository.findById(friendId).orElse(null);

          return new FriendRequestDTO(
              friendId,   // 👈 IMPORTANT: return friendId cleanly
              friendId,
              u != null ? u.getUsername() : "Unknown"
          );
        })
        .toList();
  }

  // ================= REMOVE FRIEND (FIXED) =================
  public void removeFriend(int userId, int friendId) {

    friendshipRepository
        .findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(
            userId, friendId, friendId, userId
        )
        .ifPresent(friendshipRepository::delete);
  }

  // ================= PENDING REQUESTS =================
  public List<FriendRequestDTO> getPendingRequests(int userId) {

    return friendshipRepository.findAll().stream()
        .filter(f ->
            f.getAddresseeId() != null &&
            f.getAddresseeId().equals(userId) &&
            f.getStatus() == Friendship.Status.pending
        )
        .map(f -> {
          User u = userRepository.findById(f.getRequesterId()).orElse(null);

          return new FriendRequestDTO(
              f.getRequesterId(),
              f.getRequesterId(),
              u != null ? u.getUsername() : "Unknown"
          );
        })
        .toList();
  }
}