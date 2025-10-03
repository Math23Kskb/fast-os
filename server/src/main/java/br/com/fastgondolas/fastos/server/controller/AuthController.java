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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

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

}