package com.calendarconnect.backend.service;

import com.calendarconnect.backend.model.Friendship;
import com.calendarconnect.backend.repository.FriendshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FriendshipService {

  @Autowired
  private FriendshipRepository friendshipRepository;

  // ================= SEND REQUEST (FIXED) =================
  public void sendRequest(int from, int to) {

  if (from == to) return;

  try {

    boolean exists = friendshipRepository
        .findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(
            from, to, to, from
        )
        .isPresent();

    if (exists) {
      System.out.println("Friend request already exists");
      return;
    }

    Friendship f = new Friendship();
    f.setRequesterId(from);
    f.setAddresseeId(to);
    f.setStatus(Friendship.Status.pending);

    friendshipRepository.save(f);

  } catch (Exception e) {
    System.out.println("🔥 FRIEND REQUEST ERROR:");
    e.printStackTrace(); // THIS WILL SHOW REAL ROOT CAUSE
    throw e;
  }
}

  // ================= ACCEPT REQUEST =================
  public void acceptRequest(int from, int to) {

    Friendship f = friendshipRepository
        .findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(
            from, to, to, from
        )
        .orElseThrow(() -> new RuntimeException("Request not found"));

    f.setStatus(Friendship.Status.accepted);
    friendshipRepository.save(f);
  }
}