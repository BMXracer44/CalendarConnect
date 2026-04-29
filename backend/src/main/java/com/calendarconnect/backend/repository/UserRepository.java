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

  /**
   * Check if username exists
   */
  boolean existsByUsername(String username);

  /**
   * Check if email exists
   */
  boolean existsByEmail(String email);

  /**
   * Searches user based on name and username and returns all valid results 
   */
  @Query("SELECT u FROM User u WHERE " +
       "LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(u.first_name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(u.last_name) LIKE LOWER(CONCAT('%', :query, '%'))")
  List<User> searchUsers(@Param("query") String query);
}
