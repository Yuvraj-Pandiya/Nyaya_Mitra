package com.nyayamitra.dto;

import java.util.Set;

/** JWT auth response — returned after login/register */
public record AuthResponse(String token, String username, Set<String> roles) {}
