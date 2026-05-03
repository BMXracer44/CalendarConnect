package com.calendarconnect.backend.repository;

import com.calendarconnect.backend.model.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Integer> {

  Optional<Friendship> findByRequesterIdAndAddresseeId(int requesterId, int addresseeId);

  Optional<Friendship> findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(
      int r1, int a1, int r2, int a2
  );

void deleteByRequesterIdAndAddresseeId(int requesterId, int addresseeId);

void deleteByRequesterIdAndAddresseeIdOrAddresseeIdAndRequesterId(
    int requesterId1, int addresseeId1,
    int requesterId2, int addresseeId2
);
}