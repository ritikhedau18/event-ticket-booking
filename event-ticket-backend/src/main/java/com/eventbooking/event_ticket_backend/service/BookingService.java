package com.eventbooking.event_ticket_backend.service;

import com.eventbooking.event_ticket_backend.dto.BookingResponse;
import com.eventbooking.event_ticket_backend.entity.*;
import com.eventbooking.event_ticket_backend.exception.InsufficientTicketsException;
import com.eventbooking.event_ticket_backend.exception.ResourceNotFoundException;
import com.eventbooking.event_ticket_backend.repository.BookingRepository;
import com.eventbooking.event_ticket_backend.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TicketTypeRepository ticketTypeRepository;

    @Transactional
    public BookingResponse book(Long ticketTypeId, int quantity, User user) {

        TicketType ticketType = ticketTypeRepository.findById(ticketTypeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Ticket type not found: " + ticketTypeId));

        if (ticketType.getAvailableQuantity() < quantity) {
            throw new InsufficientTicketsException(
                    "Only " + ticketType.getAvailableQuantity()
                            + " left for " + ticketType.getName()
            );
        }

        ticketType.setAvailableQuantity(
                ticketType.getAvailableQuantity() - quantity
        );

        ticketTypeRepository.save(ticketType);

        Booking booking = Booking.builder()
                .user(user)
                .ticketType(ticketType)
                .quantity(quantity)
                .totalPrice(
                        ticketType.getPrice()
                                .multiply(BigDecimal.valueOf(quantity))
                )
                .status(BookingStatus.CONFIRMED)
                .bookedAt(LocalDateTime.now())
                .build();

        return BookingResponse.fromEntity(
                bookingRepository.save(booking)
        );
    }

    public List<BookingResponse> getMyBookings(Long userId) {

        return bookingRepository.findByUserId(userId).stream()
                .map(BookingResponse::fromEntity)
                .toList();
    }
}