package com.eventbooking.event_ticket_backend.service;

import com.eventbooking.event_ticket_backend.dto.*;
import com.eventbooking.event_ticket_backend.entity.User;
import com.eventbooking.event_ticket_backend.repository.UserRepository;
import com.eventbooking.event_ticket_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;  //Used to communicate with the database.
    private final PasswordEncoder passwordEncoder;  //Used to hash passwords.
    private final JwtUtil jwtUtil; //Used to generate JWT tokens.
    private final AuthenticationManager authenticationManager; //Used to authenticate users.

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already taken");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }

        //We're converting the RegisterRequest DTO to a User Entity.

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .build();

        userRepository.save(user);

        // create a JWT

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid username or password"
                        )
                );

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getUsername(),
                user.getRole().name()
        );
    }
}
