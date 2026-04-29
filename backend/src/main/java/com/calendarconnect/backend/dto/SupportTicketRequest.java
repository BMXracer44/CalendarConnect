package com.calendarconnect.backend.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SupportTicketRequest {
    @NotBlank
    private String contactInfo;
    
    @NotNull
    private String tag;

    @NotBlank
    private String description;

    //Getters
    public String getContactInfo(){
        return contactInfo;
    }

    public String getTag(){
        return tag;
    }

    public String getDescription(){
        return description;
    }

    //Setters
    public void setContact_info(String contactInfo){
        this.contactInfo = contactInfo;
    }

    public void setTag(String tag){
        this.tag = tag;
    }

    public void setDescription(String description){
        this.description = description;
    }
}
