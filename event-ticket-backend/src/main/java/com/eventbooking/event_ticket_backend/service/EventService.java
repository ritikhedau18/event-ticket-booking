package com.eventbooking.event_ticket_backend.service;

import com.eventbooking.event_ticket_backend.dto.EventRequest;
import com.eventbooking.event_ticket_backend.dto.EventResponse;
import com.eventbooking.event_ticket_backend.entity.Event;
import com.eventbooking.event_ticket_backend.entity.EventStatus;
import com.eventbooking.event_ticket_backend.entity.User;
import com.eventbooking.event_ticket_backend.entity.Venue;
import com.eventbooking.event_ticket_backend.exception.ResourceNotFoundException;
import com.eventbooking.event_ticket_backend.repository.EventRepository;
import com.eventbooking.event_ticket_backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    public EventResponse create(EventRequest request, User organizer) {
        Venue venue = venueRepository.findById(request.venueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + request.venueId()));
        Event event = Event.builder()
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .eventDateTime(request.eventDateTime())
                .venue(venue)
                .organizer(organizer)
                .status(EventStatus.PENDING)
                .build();
        return EventResponse.fromEntity(eventRepository.save(event));
    }

    public Page<EventResponse> search(String city,String category, Pageable pageable) {

        Page<Event> events;

        if (city != null && !city.isBlank()) {

            events = eventRepository
                    .findByStatusAndVenue_CityContainingIgnoreCase(
                            EventStatus.APPROVED,
                            city,
                            pageable);

        } else if (category != null && !category.isBlank()) {

            events = eventRepository
                    .findByStatusAndCategoryContainingIgnoreCase(
                            EventStatus.APPROVED,
                            category,
                            pageable);

        } else {

            events = eventRepository.findByStatus(
                    EventStatus.APPROVED,
                    pageable);
        }

        return events.map(EventResponse::fromEntity);
    }

    public EventResponse getById(Long id) {
        return EventResponse.fromEntity(findEntity(id));
    }

    public Event findEntity(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Event not found: " + id));
    }

    public EventResponse approve(Long id) {
        Event event = findEntity(id);

        event.setStatus(EventStatus.APPROVED);

        return EventResponse.fromEntity(
                eventRepository.save(event));
    }

}
