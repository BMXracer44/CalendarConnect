package com.calendarconnect.backend.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "friendships")
  public class Friendship{

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

    @Column(nullable = false)
    private Integer requester_id;
    
    @Column(nullable = false)
    private Integer addressee_id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = status.PENDING;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime created_at;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updated_at;
    
    public enum Status{
      PENDING;
      ACCEPTED;
      DECLINED;
      BLOCKED;       
    }
    
   public friendship(){
   }

   public friendship(Integer requester_id, Integer addressee_id) {
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
    public Status getStatus(){
      return status;
    }
       
    //Setters
     public void setrequester_id(Integer requester_id){
     this.requester_id = requester_id;
     }

     public void setaddressee_id(Integer addressee_id){
     this.addressee_id = addressee_id;
    }  
     public Status setStatus(Status status){
      return this.status= status;
    }
  }
