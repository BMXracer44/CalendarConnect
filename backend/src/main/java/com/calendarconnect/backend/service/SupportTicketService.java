package com.calendarconnect.backend.service;
import com.calendarconnect.backend.dto.SupportTicketRequest;
import com.calendarconnect.backend.model.SupportTicket;
import com.calendarconnect.backend.repository.SupportTicketRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class SupportTicketService {
    @Autowired
    private SupportTicketRepository ticketRepository;


    public SupportTicket createTicket(SupportTicketRequest request){
        SupportTicket ticket = new SupportTicket();
        ticket.setContact_info(request.getEmail());
        ticket.setDescription(request.getDescription());
        try{
            ticket.setTag(
                SupportTicket.TicketTag.valueOf(
                    request.getTag().toUpperCase()
                )
            );
        } catch(IllegalArgumentException e){
            throw new RuntimeException("Inavlid tag. Tag must be BUG, HELP, or RESET.");
        }
       
        return ticketRepository.save(ticket);
    }
}
