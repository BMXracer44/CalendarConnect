package com.calendarconnect.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

  @Id
  @GenerateValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false, unique = true, length = 50)
  private String username;

  @Column(nullable = false, unique = true, length = 100)
  private String email;

  @Column(nullable = false, length = 255)
  private String password_hash;

  @Column(nullable = false, length = 50)
  private String first_name;

  @Column(nullable = false, length = 50)
  private String last_name;

  @Column(nullable = false)
  private LocalDate birthdate;

  @Column(length = 20)
  private String phone_number;

  @Column(columnDefinition = "TEXT")
  private String bio;

  @Column(length = 255)
  private String profile_picture_url;

  @Column(length = 10)
  private String theme_preference = "light";

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime created_at;

  @UpdateTimestamp
  @Column(nullable = false)
  private LocalDateTime updated_at;

  // Constructors
  public User() {
  }

  public User(String username, String email, String password_hash, String first_name,
      String last_name, LocalDate birthdate) {
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.first_name = first_name;
    this.last_name = last_name;
    this.birthdate = birthdate;
  }

  // Getters and Setters
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword_hash() {
    return password_hash;
  }

  public void setPassword_hash(String password_hash) {
    this.password_hash = password_hash;
  }

  public String getFirst_name() {
    return first_name;
  }

  public void setFirst_name(String first_name) {
    this.first_name = first_name;
  }

  public String getLast_name() {
    return last_name;
  }

  public void setLast_name(String last_name) {
    this.last_name = last_name;
  }

  public LocalDate getBirthdate() {
    return birthdate;
  }

  public void setBirthdate(LocalDate birthdate) {
    this.birthdate = birthdate;
  }

  public String getPhone_number() {
    return phone_number;
  }

  public void setPhone_number(String phone_number) {
    this.phone_number = phone_number;
  }

  public String getBio() {
    return bio;
  }

  public void setBio(String bio) {
    this.bio = bio;
  }

  public String getProfile_picture_url() {
    return profile_picture_url;
  }

  public void setProfile_picture_url(String profile_picture_url) {
    this.profile_picture_url = profile_picture_url;
  }

  public String getTheme_preference() {
    return theme_preference;
  }

  public void setTheme_preference(String theme_preference) {
    this.theme_preference = theme_preference;
  }

  public LocalDateTime getCreated_at() {
    return created_at;
  }

  public void setCreated_at(LocalDateTime created_at) {
    this.created_at = created_at;
  }

  public LocalDateTime getUpdated_at() {
    return updated_at;
  }

  public void setUpdated_at(LocalDateTime updated_at) {
    this.updated_at = updated_at;
  }
}
