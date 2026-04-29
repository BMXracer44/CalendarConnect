package com.calendarconnect.backend.repository;
import com.calendarconnect.backend.model.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Integer>{
    List<SupportTicket> findByUser_id(Integer userId);
}
    
