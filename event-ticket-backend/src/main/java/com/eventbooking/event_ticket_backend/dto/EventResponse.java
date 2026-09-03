package com.eventbooking.event_ticket_backend.dto;

import com.eventbooking.event_ticket_backend.entity.Event;
import com.eventbooking.event_ticket_backend.entity.EventStatus;

import java.time.LocalDateTime;

public record EventResponse(
        Long id,
        String title,
        String description,
        String category,
        LocalDateTime eventDateTime,
        String venueName,
        String venueCity,
        String organizerUsername,
        EventStatus status
) {

    public static EventResponse fromEntity(Event event) {
        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getCategory(),
                event.getEventDateTime(),
                event.getVenue().getName(),
                event.getVenue().getCity(),
                event.getOrganizer().getUsername(),
                event.getStatus()
        );
    }
}
