package com.nyayamitra.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** Auth request body for login and registration */
@Data
public class AuthRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    private String email; // optional for login, used in register
}
