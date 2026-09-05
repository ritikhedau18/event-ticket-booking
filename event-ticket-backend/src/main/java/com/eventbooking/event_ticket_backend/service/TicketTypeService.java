package com.eventbooking.event_ticket_backend.service;

import com.eventbooking.event_ticket_backend.dto.IncreaseTicketQuantityRequest;
import com.eventbooking.event_ticket_backend.dto.TicketTypeRequest;
import com.eventbooking.event_ticket_backend.dto.TicketTypeResponse;
import com.eventbooking.event_ticket_backend.dto.UpdateTicketTypeRequest;
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

    private void checkPermission(TicketType ticketType, User requester) {

        boolean isOwner =
                ticketType.getEvent().getOrganizer().getId()
                        .equals(requester.getId());

        boolean isAdmin =
                requester.getRole().name().equals("ADMIN");

        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException(
                    "Only the event's organizer or an admin can manage this ticket type");
        }
    }

    public TicketTypeResponse update(
            Long ticketTypeId,
            UpdateTicketTypeRequest request,
            User requester) {

        TicketType ticketType = ticketTypeRepository.findById(ticketTypeId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Ticket type not found"));

        checkPermission(ticketType, requester);

        ticketType.setName(request.name());
        ticketType.setPrice(request.price());

        return TicketTypeResponse.fromEntity(
                ticketTypeRepository.save(ticketType));
    }

    public TicketTypeResponse increaseQuantity(
            Long ticketTypeId,
            IncreaseTicketQuantityRequest request,
            User requester) {

        TicketType ticketType = ticketTypeRepository.findById(ticketTypeId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Ticket type not found"));

        checkPermission(ticketType, requester);

        ticketType.setTotalQuantity(
                ticketType.getTotalQuantity() + request.quantity());

        ticketType.setAvailableQuantity(
                ticketType.getAvailableQuantity() + request.quantity());

        return TicketTypeResponse.fromEntity(
                ticketTypeRepository.save(ticketType));
    }

}
