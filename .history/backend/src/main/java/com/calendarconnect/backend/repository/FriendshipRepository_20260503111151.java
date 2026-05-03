package com.calendarconnect.backend.repository;

import com.calendarconnect.backend.model.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Integer> {

  Optional<Friendship> findByRequesterIdAndAddresseeIdOrAddresseeIdAndRequesterId(
      Integer r1, Integer a1, Integer r2, Integer a2
  );
}