package com.eventbooking.event_ticket_backend.controller;

import com.eventbooking.event_ticket_backend.dto.BookingRequest;
import com.eventbooking.event_ticket_backend.dto.BookingResponse;
import com.eventbooking.event_ticket_backend.entity.User;
import com.eventbooking.event_ticket_backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<BookingResponse> book(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal User user) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        bookingService.book(
                                request.ticketTypeId(),
                                request.quantity(),
                                user
                        )
                );
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public List<BookingResponse> myBookings(
            @AuthenticationPrincipal User user) {

        return bookingService.getMyBookings(user.getId());
    }
}