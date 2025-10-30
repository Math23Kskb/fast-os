package br.com.fastgondolas.fastos.server.service;

import br.com.fastgondolas.fastos.server.dto.LoginRequestDto;
import br.com.fastgondolas.fastos.server.exception.UserAlreadyExistsException;
import br.com.fastgondolas.fastos.server.model.User;
import br.com.fastgondolas.fastos.server.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
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

    @Mock
    private JwtService jwtService;

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
    @DisplayName("Deve registrar um novo usuário com sucesso")
    void whenRegisteringNewUser_shouldSucceed() {
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
    @DisplayName("Deve lançar exceção se o nome de usuário já existir")
    void whenUsernameAlreadyExists_shouldThrowUserAlreadyExistsException() {
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));

        Exception exception = assertThrows(UserAlreadyExistsException.class, () -> {
            userService.registerUser(user);
        });

        assertEquals("Um usuário com este nome de usuário ou email já existe.", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Deve lançar exceção se o email já existir")
    void whenEmailAlreadyExists_shouldThrowUserAlreadyExistsException() {
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        Exception exception = assertThrows(UserAlreadyExistsException.class, () -> {
            userService.registerUser(user);
        });

        assertEquals("Um usuário com este nome de usuário ou email já existe.", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Deve retornar um token JWT quando as credenciais de login estão corretas")
    void whenLoginWithCorrectCredentials_shouldReturnJwtToken() {
        // ARRANGE
        var loginRequestDto = new LoginRequestDto("testuser", "rawPassword123");
        var userFromDb = new User();
        userFromDb.setUsername("testuser");
        userFromDb.setPassword("hashedPassword");
        var expectedToken = "token.jwt.gerado.pelo.mock";

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(userFromDb));
        when(passwordEncoder.matches("rawPassword123", "hashedPassword")).thenReturn(true);
        when(jwtService.generateToken(userFromDb)).thenReturn(expectedToken);

        String actualToken = userService.loginUser(loginRequestDto);

        assertNotNull(actualToken);
        assertEquals(expectedToken, actualToken);
        verify(jwtService, times(1)).generateToken(userFromDb);
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar logar com usuário inexistente")
    void whenLoginWithNonExistentUser_shouldThrowBadCredentialsException() {
        var loginRequestDto = new LoginRequestDto("nonexistentuser", "somepassword");
        when(userRepository.findByUsername(loginRequestDto.username())).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> {
            userService.loginUser(loginRequestDto);
        });

        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar logar com a senha incorreta")
    void whenLoginWithWrongCredentials_shouldThrowBadCredentialsException() {
        var loginRequestDto = new LoginRequestDto("testuser", "wrongpassword");
        var userFromDb = new User();
        userFromDb.setUsername("testuser");
        userFromDb.setPassword("hashedPassword");

        when(userRepository.findByUsername(loginRequestDto.username())).thenReturn(Optional.of(userFromDb));
        when(passwordEncoder.matches("wrongpassword", "hashedPassword")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> {
            userService.loginUser(loginRequestDto);
        });

        verify(jwtService, never()).generateToken(any(User.class));
    }
}