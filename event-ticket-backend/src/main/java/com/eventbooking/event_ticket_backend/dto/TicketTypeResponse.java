package com.eventbooking.event_ticket_backend.dto;

import com.eventbooking.event_ticket_backend.entity.TicketType;

import java.math.BigDecimal;

public record TicketTypeResponse(
        Long id,
        String name,
        BigDecimal price,
        Integer availableQuantity,
        Long eventId
) {

    public static TicketTypeResponse fromEntity(TicketType t) {
        return new TicketTypeResponse(
                t.getId(),
                t.getName(),
                t.getPrice(),
                t.getAvailableQuantity(),
                t.getEvent().getId()
        );
    }
}
