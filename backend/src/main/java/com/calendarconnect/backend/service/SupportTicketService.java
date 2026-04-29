package com.calendarconnect.backend.service;
import com.calendarconnect.backend.dto.SupportTicketRequest;
import com.calendarconnect.backend.model.SupportTicket;
import com.calendarconnect.backend.model.User;
import com.calendarconnect.backend.repository.SupportTicketRepository;
import com.calendarconnect.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupportTicketService {
    @Autowired
    private SupportTicketRepository ticketRepository;
    @Autowired
    private UserRepository userRepository;

    public SupportTicket createTicket(SupportTicketRequest request)throws Exception{
        
        String contact = request.getContactInfo();

        User user = userRepository.findByEmail(contact).orElse(null);
        if(user == null){
            user = userRepository.findbyPhoneNumber(contact).orElseThrow(new Exception("No user with that contact info can be found"));
        }
        
        

        SupportTicket ticket = new SupportTicket();
        ticket.setUser_id(user.getId());
        ticket.setContact_info(contact);
        ticket.setDescription(request.getDescription());
        ticket.setTag(SupportTicket.TicketTag.valueOf(request.getTag().toUpperCase()));
        
        return ticketRepository.save(ticket);
    }
}
