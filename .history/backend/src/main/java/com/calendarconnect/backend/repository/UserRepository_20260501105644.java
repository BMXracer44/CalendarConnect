package com.calendarconnect.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.calendarconnect.backend.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

  Optional<User> findByUsername(String username);
  Optional<User> findByEmail(String email);

  boolean existsByUsername(String username);
  boolean existsByEmail(String email);

  // ================= SEARCH USERS =================
  @Query("SELECT u FROM User u WHERE " +
       "LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(u.first_name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(u.last_name) LIKE LOWER(CONCAT('%', :query, '%'))")
  List<User> searchUsers(@Param("query") String query);
}