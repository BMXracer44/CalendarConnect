package com.calendarconnect.backend.repository;

import com.calendarconnect.backend.model.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Integer> {

  Optional<Friendship> findByRequesterIdAndAddresseeId(int requesterId, int addresseeId);

  Optional<Friendship> findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(
      int r1, int a1, int r2, int a2
  );

void deleteByUser1IdAndUser2Id(int user1Id, int user2Id);

void deleteByUser2IdAndUser1Id(int user1Id, int user2Id);
}