package com.calendarconnect.backend.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "friendships")
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private Integer requester_id;

    @Column(nullable = false)
    private Integer addressee_id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime created_at;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updated_at;

    public enum Status {
        PENDING,
        ACCEPTED,
        DECLINED,
        BLOCKED
    }

    public Friendship() {
    }

    public Friendship(Integer requester_id, Integer addressee_id) {
        this.requester_id = requester_id;
        this.addressee_id = addressee_id;
    }

    // Getters
    public Integer getId() {
        return id;
    }

    public Integer getRequester_id() {
        return requester_id;
    }

    public Integer getAddressee_id() {
        return addressee_id;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }

    public Status getStatus() {
        return status;
    }

    // Setters
    public void setId(Integer id) {
        this.id = id;
    }

    public void setRequester_id(Integer requester_id) {
        this.requester_id = requester_id;
    }

    public void setAddressee_id(Integer addressee_id) {
        this.addressee_id = addressee_id;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}

