package com.calendarconnect.backend.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public class SupportTicketRequest {
    @NotBlank
    private String email;
   
    @NotNull
    private String tag;


    @NotBlank
    private String description;


    //Getters
    public String getEmail(){
        return email;
    }


    public String getTag(){
        return tag;
    }


    public String getDescription(){
        return description;
    }


    //Setters
    public void setEmail(String email){
        this.email = email;
    }


    public void setTag(String tag){
        this.tag = tag;
    }


    public void setDescription(String description){
        this.description = description;
    }
}
