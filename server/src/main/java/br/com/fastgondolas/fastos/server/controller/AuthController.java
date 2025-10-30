package br.com.fastgondolas.fastos.server.controller;

import br.com.fastgondolas.fastos.server.dto.LoginRequestDto;
import br.com.fastgondolas.fastos.server.dto.LoginResponseDto;
import br.com.fastgondolas.fastos.server.dto.RegisterUserDto;
import br.com.fastgondolas.fastos.server.dto.UserResponseDto;
import br.com.fastgondolas.fastos.server.model.User;
import br.com.fastgondolas.fastos.server.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> loginUser(@Valid @RequestBody LoginRequestDto loginRequestDto) {

        String token = userService.loginUser(loginRequestDto);
        LoginResponseDto loginResponseDto = new LoginResponseDto(token);
        return ResponseEntity.ok(loginResponseDto);

    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@Valid @RequestBody RegisterUserDto registerUserDto) {

        User newUser = new  User();
        newUser.setUsername(registerUserDto.username());
        newUser.setPassword(registerUserDto.password());
        newUser.setEmail(registerUserDto.email());

        User savedUser = userService.registerUser(newUser);

        UserResponseDto userResponseDto = new UserResponseDto(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail()
        );

        return new ResponseEntity<>(userResponseDto, HttpStatus.CREATED);
    }

    @GetMapping("/hash/{password}")
    public String getHash(@PathVariable String password) {
        return passwordEncoder.encode(password);
    }

}