package com.eventbooking.event_ticket_backend.service;

import com.eventbooking.event_ticket_backend.dto.VenueRequest;
import com.eventbooking.event_ticket_backend.entity.Venue;
import com.eventbooking.event_ticket_backend.exception.ResourceNotFoundException;
import com.eventbooking.event_ticket_backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;

    public Venue create(VenueRequest request) {
        Venue venue = Venue.builder()
                .name(request.name())
                .address(request.address())
                .city(request.city())
                .capacity(request.capacity())
                .build();
        return venueRepository.save(venue);
    }

    public List<Venue>  getAll() {
        return venueRepository.findAll();
    }

    public Venue getById(Long id) {
        return venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id ));
    }

    public Venue update(Long id, VenueRequest request) {
        Venue venue = getById(id);
        venue.setName(request.name());
        venue.setAddress(request.address());
        venue.setCity(request.city());
        venue.setCapacity(request.capacity());
        return venueRepository.save(venue);
    }

    public void delete(Long id) {
        venueRepository.deleteById(id);
    }

}
