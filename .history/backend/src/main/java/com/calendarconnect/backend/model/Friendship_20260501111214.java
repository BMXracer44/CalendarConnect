package com.calendarconnect.backend.model;

import jakarta.persistence.*;

@Entity
@Table(
  name = "friendships",
  uniqueConstraints = {
    @UniqueConstraint(columnNames = {"requesterId", "addresseeId"})
  }
)
public class Friendship {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  private Integer requesterId;
  private Integer addresseeId;

  @Enumerated(EnumType.STRING)
  private Status status;

  public enum Status {
    pending,
    accepted,
    declined
  }

  public Integer getId() { return id; }

  public Integer getRequesterId() { return requesterId; }
  public void setRequesterId(Integer requesterId) { this.requesterId = requesterId; }

  public Integer getAddresseeId() { return addresseeId; }
  public void setAddresseeId(Integer addresseeId) { this.addresseeId = addresseeId; }

  public Status getStatus() { return status; }
  public void setStatus(Status status) { this.status = status; }
}