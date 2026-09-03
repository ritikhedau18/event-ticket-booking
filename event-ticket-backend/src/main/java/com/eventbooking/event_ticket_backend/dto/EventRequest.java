package com.eventbooking.event_ticket_backend.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record EventRequest(
        @NotBlank String title,
        String description,
        @NotBlank String category,
        @NotNull @Future LocalDateTime eventDateTime,
        @NotNull Long venueId
) {}