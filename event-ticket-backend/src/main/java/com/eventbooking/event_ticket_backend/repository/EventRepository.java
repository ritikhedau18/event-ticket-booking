package com.eventbooking.event_ticket_backend.repository;

import com.eventbooking.event_ticket_backend.entity.Event;
import com.eventbooking.event_ticket_backend.entity.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    Page<Event> findByStatus(EventStatus status, Pageable pageable);

    Page<Event> findByStatusAndVenue_CityContainingIgnoreCase(
            EventStatus status,
            String city,
            Pageable pageable
    );

    Page<Event> findByStatusAndCategoryContainingIgnoreCase(
            EventStatus status,
            String category,
            Pageable pageable
    );

    List<Event> findByOrganizerId(Long organizerId);

    List<Event> findByStatus(EventStatus status);

}
