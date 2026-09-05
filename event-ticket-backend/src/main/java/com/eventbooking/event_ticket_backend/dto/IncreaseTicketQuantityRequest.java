package com.eventbooking.event_ticket_backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record IncreaseTicketQuantityRequest(
        @NotNull @Min(1) Integer quantity
) {}