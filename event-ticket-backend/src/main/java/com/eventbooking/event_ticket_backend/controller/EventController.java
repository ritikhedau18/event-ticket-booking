package com.eventbooking.event_ticket_backend.controller;

import com.eventbooking.event_ticket_backend.dto.EventRequest;
import com.eventbooking.event_ticket_backend.dto.EventResponse;
import com.eventbooking.event_ticket_backend.entity.User;
import com.eventbooking.event_ticket_backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    public ResponseEntity<EventResponse> create(
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal User organizer) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.create(request, organizer));
    }

    @GetMapping
    public Page<EventResponse> search(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return eventService.search(
                city,
                category,
                PageRequest.of(page, size)
        );
    }

    @GetMapping("/{id}")
    public EventResponse getById(@PathVariable Long id) {
        return eventService.getById(id);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public EventResponse approve(@PathVariable Long id) {
        return eventService.approve(id);
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    public List<EventResponse> myEvents(
            @AuthenticationPrincipal User user) {

        return eventService.getMyEvents(user.getId());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public List<EventResponse> pendingEvents() {
        return eventService.getPendingEvents();
    }

}
