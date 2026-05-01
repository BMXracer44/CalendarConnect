package com.calendarconnect.backend.service;

import com.calendarconnect.backend.model.Friendship;
import com.calendarconnect.backend.repository.FriendshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FriendshipService {

  @Autowired
  private FriendshipRepository friendshipRepository;

  // ================= SEND REQUEST =================
  public void sendRequest(int from, int to) {

    boolean exists = friendshipRepository
        .findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(
            from, to, to, from
        )
        .isPresent();

    if (exists) {
      throw new RuntimeException("Friend request already exists");
    }

    Friendship f = new Friendship();
    f.setRequesterId(from);
    f.setAddresseeId(to);
    f.setStatus(Friendship.Status.pending);

    friendshipRepository.save(f);
  }

  // ================= ACCEPT REQUEST =================
  public void acceptRequest(int from, int to) {

    Friendship f = friendshipRepository
        .findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(
            from, to, to, from
        )
        .orElseThrow(() -> new RuntimeException("Friend request not found"));

    f.setStatus(Friendship.Status.accepted);
    friendshipRepository.save(f);
  }
}