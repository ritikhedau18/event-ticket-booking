package com.eventbooking.event_ticket_backend.service;

import com.eventbooking.event_ticket_backend.dto.TicketTypeRequest;
import com.eventbooking.event_ticket_backend.dto.TicketTypeResponse;
import com.eventbooking.event_ticket_backend.entity.Event;
import com.eventbooking.event_ticket_backend.entity.TicketType;
import com.eventbooking.event_ticket_backend.entity.User;
import com.eventbooking.event_ticket_backend.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketTypeService {

    private final TicketTypeRepository ticketTypeRepository;
    private final EventService eventService;

    public TicketTypeResponse create(
            Long eventId,
            TicketTypeRequest request,
            User requester) {

        Event event = eventService.findEntity(eventId);

        boolean isOwner =
                event.getOrganizer().getId().equals(requester.getId());

        boolean isAdmin =
                requester.getRole().name().equals("ADMIN");

        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException(
                    "Only the event's organizer or an admin can add ticket types");
        }

        TicketType ticketType = TicketType.builder()
                .name(request.name())
                .price(request.price())
                .totalQuantity(request.totalQuantity())
                .availableQuantity(request.totalQuantity())
                .event(event)
                .build();

        return TicketTypeResponse.fromEntity(
                ticketTypeRepository.save(ticketType));
    }

    public List<TicketTypeResponse> getByEvent(Long eventId) {

        return ticketTypeRepository.findByEventId(eventId)
                .stream()
                .map(TicketTypeResponse::fromEntity)
                .toList();
    }
}
