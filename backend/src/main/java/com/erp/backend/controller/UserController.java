package com.erp.backend.controller;

import com.erp.backend.model.AppUser;
import com.erp.backend.model.Role;
import com.erp.backend.repository.AppUserRepository;

import com.erp.backend.repository.AppUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AppUserRepository repository;
    private final PasswordEncoder passwordEncoder; // <-- Agregado para encriptar

    // Inyectamos ambos en el constructor
    public UserController(AppUserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = repository.findAll().stream()
                .map(u -> new UserDTO(u.getId(), u.getUsername(), u.getRole().name()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // NUEVO: Endpoint para crear usuarios
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody NewUserDTO newUser) {
        // 1. Crear la entidad
        AppUser user = new AppUser();
        user.setUsername(newUser.username());
        
        // 2. Encriptar la contraseña antes de guardar (¡Clave!)
        user.setPassword(passwordEncoder.encode(newUser.password()));
        
        // 3. Asignar el rol (asumimos que tienes un Enum Role)
        user.setRole(Role.valueOf(newUser.role().toUpperCase())); 
        
        // 4. Guardar y devolver el DTO seguro
        AppUser saved = repository.save(user);
        return ResponseEntity.status(201).body(
            new UserDTO(saved.getId(), saved.getUsername(), saved.getRole().name())
        );
    }

    // DTOs
    public record UserDTO(Long id, String username, String role) {}
    public record NewUserDTO(String username, String password, String role) {} // DTO para recibir datos
}