package com.calendarconnect.backend.repository;

import com.calendarconnect.backend.model.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Integer> {

  Optional<Friendship> findByRequesterIdAndAddresseeId(int requesterId, int addresseeId);

  Optional<Friendship> findByRequesterIdAndAddresseeIdOrRequesterIdAndAddresseeId(
      int r1, int a1, int r2, int a2
  );
}