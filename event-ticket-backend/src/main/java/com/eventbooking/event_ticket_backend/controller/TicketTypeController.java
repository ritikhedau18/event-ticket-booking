package com.eventbooking.event_ticket_backend.controller;

import com.eventbooking.event_ticket_backend.dto.TicketTypeRequest;
import com.eventbooking.event_ticket_backend.dto.TicketTypeResponse;
import com.eventbooking.event_ticket_backend.entity.User;
import com.eventbooking.event_ticket_backend.service.TicketTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/{eventId}/ticket-types")
@RequiredArgsConstructor
public class TicketTypeController {

    private final TicketTypeService ticketTypeService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    public ResponseEntity<TicketTypeResponse> create(
            @PathVariable Long eventId,
            @Valid @RequestBody TicketTypeRequest request,
            @AuthenticationPrincipal User user) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketTypeService.create(eventId, request, user));
    }

    @GetMapping
    public List<TicketTypeResponse> getByEvent(
            @PathVariable Long eventId) {

        return ticketTypeService.getByEvent(eventId);
    }
}
