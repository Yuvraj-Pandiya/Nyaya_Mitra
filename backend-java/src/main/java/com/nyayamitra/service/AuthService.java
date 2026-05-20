package com.nyayamitra.service;

import com.nyayamitra.dto.AuthRequest;
import com.nyayamitra.dto.AuthResponse;
import com.nyayamitra.entity.AppUser;
import com.nyayamitra.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.nyayamitra.security.JwtUtils;

import java.util.Set;

/**
 * AuthService — NEW module (not in Node.js backend — added for admin protection).
 * Handles user registration and JWT login.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        AppUser user = AppUser.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .email(request.getEmail())
            .roles(Set.of("ROLE_USER"))
            .enabled(true)
            .build();
        userRepository.save(user);

        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        return new AuthResponse(jwtUtils.generateToken(auth), user.getUsername(), user.getRoles());
    }

    public AuthResponse login(AuthRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        AppUser user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        return new AuthResponse(jwtUtils.generateToken(auth), user.getUsername(), user.getRoles());
    }
}
