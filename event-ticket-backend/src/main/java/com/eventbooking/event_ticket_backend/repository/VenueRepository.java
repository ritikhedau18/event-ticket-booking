package com.eventbooking.event_ticket_backend.repository;

import com.eventbooking.event_ticket_backend.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRepository extends JpaRepository<Venue, Long>{
}
