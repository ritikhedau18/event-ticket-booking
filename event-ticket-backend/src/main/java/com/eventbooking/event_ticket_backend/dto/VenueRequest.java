package com.eventbooking.event_ticket_backend.dto;

import jakarta.validation.constraints.NotBlank;

public record VenueRequest(
     @NotBlank String name,
     @NotBlank String address,
     @NotBlank String city,
        Integer capacity
) { }
