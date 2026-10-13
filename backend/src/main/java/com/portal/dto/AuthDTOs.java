package com.portal.dto;

import com.portal.model.User;
import jakarta.validation.constraints.*;
import lombok.*;

// ── Auth DTOs ─────────────────────────────────────────────────────────────────

public class AuthDTOs {

    @Data
    public static class RegisterRequest {
        @NotBlank private String fullName;
        @Email @NotBlank private String email;
        @NotBlank @Size(min = 6) private String password;
        private User.Role role = User.Role.STUDENT;
    }

    @Data
    public static class LoginRequest {
        @Email @NotBlank private String email;
        @NotBlank private String password;
    }

    @Data @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private String email;
        private String fullName;
        private String role;
    }

    @Data @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String fullName;
        private String email;
        private String role;
    }
}
