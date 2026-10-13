package com.portal.controller;

import com.portal.dto.AuthDTOs.*;
import com.portal.model.User;
import com.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(u -> new UserDto(u.getId(), u.getFullName(), u.getEmail(), u.getRole().name()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/students")
    public ResponseEntity<List<UserDto>> getStudents() {
        List<UserDto> students = userRepository.findByRole(User.Role.STUDENT).stream()
                .map(u -> new UserDto(u.getId(), u.getFullName(), u.getEmail(), u.getRole().name()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(students);
    }

    @GetMapping("/users/instructors")
    public ResponseEntity<List<UserDto>> getInstructors() {
        List<UserDto> instructors = userRepository.findByRole(User.Role.INSTRUCTOR).stream()
                .map(u -> new UserDto(u.getId(), u.getFullName(), u.getEmail(), u.getRole().name()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(instructors);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
