package com.eventbooking.event_ticket_backend.dto;

import com.eventbooking.event_ticket_backend.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank String username,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, message = "Password must be at least 6 characters") String password,
        @NotNull Role role
) {}

