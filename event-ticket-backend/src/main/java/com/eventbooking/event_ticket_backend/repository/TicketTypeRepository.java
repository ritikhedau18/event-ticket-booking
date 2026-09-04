package com.eventbooking.event_ticket_backend.repository;

import com.eventbooking.event_ticket_backend.entity.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {

    List<TicketType> findByEventId(Long eventId);
}