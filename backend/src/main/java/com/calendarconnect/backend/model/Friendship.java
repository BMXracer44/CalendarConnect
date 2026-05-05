package com.calendarconnect.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "friendships")
public class Friendship {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(name = "requester_id", nullable = false)
  private Integer requesterId;

  @Column(name = "addressee_id", nullable = false)
  private Integer addresseeId;

  @Enumerated(EnumType.STRING)
  @Column(name = "status")
  private Status status;

  public enum Status {
    pending,
    accepted,
    declined
  }

  public Integer getId() {
    return id;
  }

  public Integer getRequesterId() {
    return requesterId;
  }

  public void setRequesterId(Integer requesterId) {
    this.requesterId = requesterId;
  }

  public Integer getAddresseeId() {
    return addresseeId;
  }

  public void setAddresseeId(Integer addresseeId) {
    this.addresseeId = addresseeId;
  }

  public Status getStatus() {
    return status;
  }

  public void setStatus(Status status) {
    this.status = status;
  }
}