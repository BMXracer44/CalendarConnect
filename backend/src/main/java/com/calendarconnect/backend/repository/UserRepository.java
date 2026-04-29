package com.calendarconnect.backend.repository;

import com.calendarconnect.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

  /**
   * Find a user by username
   */
  Optional<User> findByUsername(String username);

  /**
   * Find a user by email
   */
  Optional<User> findByEmail(String email);

  Optional<User> findbyPhoneNumber(String phone_number);

  /**
   * Check if username exists
   */
  boolean existsByUsername(String username);

  /**
   * Check if email exists
   */
  boolean existsByEmail(String email);
}
