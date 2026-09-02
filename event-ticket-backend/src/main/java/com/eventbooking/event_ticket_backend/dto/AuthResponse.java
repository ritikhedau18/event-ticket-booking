package com.eventbooking.event_ticket_backend.dto;

public record AuthResponse(
        String token,
        String username,
        String role
) {}
