package com.calendarconnect.backend.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "support_tickets")


public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


     @Column(nullable = false)
    private String contact_info;


     @Enumerated(EnumType.STRING)
    private TicketTag tag;


    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;


    @Enumerated(EnumType.STRING)
    private TicketStatus status = TicketStatus.OPEN;


    private LocalDateTime created_at = LocalDateTime.now();


    public enum TicketTag{
        BUG, HELP, RESET
    }
    public enum TicketStatus{
        OPEN, IN_PROGRESS, RESOLVED
    }


    //Getters
    public Integer getId(){
        return id;
    }


    public String getContactInfo(){
        return contact_info;
    }


    public TicketTag getTag(){
        return tag;
    }


    public String getDescription(){
        return description;
    }


    public TicketStatus getStatus(){
        return status;
    }


    public LocalDateTime getCreated_at(){
        return created_at ;
    }


    //Setters
    public void setId(Integer id){
     this.id = id;
    }


    public void setContact_info(String contact_info){
        this.contact_info= contact_info;
    }


    public void setTag(TicketTag tag){
        this.tag = tag;
    }


    public void setDescription(String description){
        this.description = description;
    }


    public void SetStatus(TicketStatus status){
        this.status = status;
    }


    public void setCreated_at(LocalDateTime created_at){
        this.created_at = created_at;
    }
}
