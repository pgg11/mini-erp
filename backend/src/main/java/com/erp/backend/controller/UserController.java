package com.erp.backend.controller;

import com.erp.backend.repository.AppUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AppUserRepository repository;

    public UserController(AppUserRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        // Usamos un DTO (Data Transfer Object) para asegurar que jamás enviamos
        // las contraseñas encriptadas al frontend por accidente.
        List<UserDTO> users = repository.findAll().stream()
                .map(u -> new UserDTO(u.getId(), u.getUsername(), u.getRole().name()))
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(users);
    }

    // Estructura interna para enviar solo los datos seguros
    public record UserDTO(Long id, String username, String role) {}
}