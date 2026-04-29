package com.calendarconnect.backend.controller;

import com.calendarconnect.backend.dto.SupportTicketRequest;
import com.calendarconnect.backend.model.SupportTicket;
import com.calendarconnect.backend.service.SupportTicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
public class SupportTicketController {
    @Autowired
    private SupportTicketService ticketService;

    @PostMapping("/submit")
    public SupportTicket submitTicket(@Valid@RequestBody SupportTicketRequest request)throws Exception{
        return ticketService.createTicket(request);
    }
}
