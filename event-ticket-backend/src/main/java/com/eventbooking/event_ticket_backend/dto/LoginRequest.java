package com.eventbooking.event_ticket_backend.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank String username,
        @NotBlank String password
) {}
