package com.calendarconnect.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.calendarconnect.backend.model.Friendship;
import com.calendarconnect.backend.repository.FriendshipRepository;

@Service
public class FriendshipService {

  @Autowired
  private FriendshipRepository friendshipRepository;

  public void sendRequest(int from, int to) {

    if (friendshipRepository
        .findByRequesterIdAndAddresseeId(from, to)
        .isPresent()) {
      throw new RuntimeException("Request already exists");
    }

    Friendship f = new Friendship();
    f.setRequesterId(from);
    f.setAddresseeId(to);
    f.setStatus(Friendship.Status.pending);

    friendshipRepository.save(f);
  }
}