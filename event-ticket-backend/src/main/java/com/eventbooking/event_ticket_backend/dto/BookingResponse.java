package com.eventbooking.event_ticket_backend.dto;

import com.eventbooking.event_ticket_backend.entity.Booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingResponse(
        Long id,
        String eventTitle,
        String ticketTypeName,
        Integer quantity,
        BigDecimal totalPrice,
        String status,
        LocalDateTime bookedAt
) {

    public static BookingResponse fromEntity(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getTicketType().getEvent().getTitle(),
                b.getTicketType().getName(),
                b.getQuantity(),
                b.getTotalPrice(),
                b.getStatus().name(),
                b.getBookedAt()
        );
    }
}
