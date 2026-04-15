package com.calendarconnect.backend.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "friendships")
  public class Friendship{

@FriendshipId
@GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

    @Column(nullable = false)
    private Integer requester_id;
    
    @Column(nullable = false)
    private Integer addressee_id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = status.pending;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime created_at;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updated_at;
    
    public enum Status{
      pending;
      accepted;
      declined;
      blocked;        }

   public friendship(){
   }

   public friendship(int requester_id, int addressee_id) {
     this.requester_id = requester_id;
     this.addressee_id = addressee_id;

    }
    
    //Getters
    public Integer getrequester_id() {
      return requester_id;
    }

     public Integer getaddressee_id() {
      return addressee_id;
      
    public LocalDateTime getCreated_at() {
      return created_at;
    }
  
       
    //Setters
     public void setrequester_id(String requester_id){
     this.requester_id = requester_id;
     }

     public void setaddressee_id(String addressee_id){
     this.addressee_id = addressee_id;
    }  
  }
