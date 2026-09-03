package com.eventbooking.event_ticket_backend.exception;

public class InsufficientTicketsException extends RuntimeException {

    public InsufficientTicketsException(String message) {
        super(message);
    }
}
