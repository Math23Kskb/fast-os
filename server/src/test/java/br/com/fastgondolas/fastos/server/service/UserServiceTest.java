package br.com.fastgondolas.fastos.server.service;

import br.com.fastgondolas.fastos.server.dto.LoginRequestDto;
import br.com.fastgondolas.fastos.server.exception.UserAlreadyExistsException;
import br.com.fastgondolas.fastos.server.model.User;
import br.com.fastgondolas.fastos.server.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername("testuser");
        user.setPassword("rawPassword123");
        user.setEmail("test@example.com");
    }

    @Test
    void whenRegiseringNewUser_shouldSucceed() {
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        when(passwordEncoder.encode(user.getPassword())).thenReturn("hashedPassword");

        when(userRepository.save(any(User.class))).thenReturn(user);

        User savedUser = userService.registerUser(user);

        assertNotNull(savedUser);
        assertEquals("hashedPassword", savedUser.getPassword());

        verify(userRepository, times(1)).save(user);
    }

    @Test
    void whenUsernameAlreadyExists_shouldThrowUserAlreadyExistsException() {
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(UserAlreadyExistsException.class, () -> {
            userService.registerUser(user);
        });

        assertEquals("Um usuário com este nome de usuário ou email já existe.",  exception.getMessage());

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void whenEmailAlreadyExists_shouldThrowUserAlreadyExistsException() {
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        UserAlreadyExistsException exception = assertThrows(UserAlreadyExistsException.class, () -> {
            userService.registerUser(user);
        });

        assertEquals("Um usuário com este nome de usuário ou email já existe.", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void whenLoginWithCorrectCredentials_shouldReturnPlaceholderToken() {
        LoginRequestDto loginRequestDto = new LoginRequestDto("testuser", "rawPassword123");
        String hashedPasswordTokenFromDB = "hashedPassword";
        user.setPassword(hashedPasswordTokenFromDB);

        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                loginRequestDto.password(),
                hashedPasswordTokenFromDB
                ))
                .thenReturn(true);

        String token = userService.loginUser(loginRequestDto);

        assertNotNull(token);
        assertTrue(token.contains(user.getUsername()));
        assertEquals("jwt.placeholder.token.for.testuser", token);
    }

    @Test
    void whenLoginWithNonExistentUser_shouldThrowBadCredentialsException() {
        LoginRequestDto loginRequestDto = new LoginRequestDto("nonexistentuser", "somepassword");

        when(userRepository.findByUsername(loginRequestDto.username())).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> {
            userService.loginUser(loginRequestDto);
        });

        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void whenLoginWithWrongCredentials_shouldThrowBadCredentialsException() {
        LoginRequestDto loginRequestDto = new LoginRequestDto("testuser", "wrongpassword");
        String hashedPasswordTokenFromDB = "hashedPassword";
        user.setPassword(hashedPasswordTokenFromDB);

        when(userRepository.findByUsername(loginRequestDto.username())).thenReturn(Optional.of(user));

        when(passwordEncoder.matches(loginRequestDto.password(),
                hashedPasswordTokenFromDB)).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> {
            userService.loginUser(loginRequestDto);
        });

    }

}