package com.erp.backend.config;

import com.erp.backend.model.AppUser;
import com.erp.backend.model.Role;
import com.erp.backend.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Bean
    CommandLineRunner initDatabase(AppUserRepository repository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (repository.count() == 0) {
                AppUser admin = new AppUser();
                admin.setUsername(adminUsername);
                // Encripta la contraseña que viene del archivo .env
                admin.setPassword(passwordEncoder.encode(adminPassword)); 
                admin.setRole(Role.ADMIN);
                
                repository.save(admin);
                System.out.println("====== USUARIO ADMINISTRADOR CREADO ======");
                System.out.println("Username: " + adminUsername);
                System.out.println("Rol: ADMIN");
                System.out.println("==========================================");
            }
        };
    }
}