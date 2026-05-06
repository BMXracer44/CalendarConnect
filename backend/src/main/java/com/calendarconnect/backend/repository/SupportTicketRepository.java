package com.calendarconnect.backend.repository;
import com.calendarconnect.backend.model.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SupportTicketRepository extends JpaRepository<SupportTicket, Integer>{
}
