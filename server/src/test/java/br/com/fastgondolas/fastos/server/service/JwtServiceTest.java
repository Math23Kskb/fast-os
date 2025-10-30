package br.com.fastgondolas.fastos.server.service;

import br.com.fastgondolas.fastos.server.model.User;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private User testUser;

    private final String SECRET_KEY_FOR_TEST = "minha-chave-secreta-de-teste-deve-ser-longa-o-suficiente-para-funcionar";
    private final Long EXPIRATION_FOR_TEST = 3600000L;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secret", SECRET_KEY_FOR_TEST);
        ReflectionTestUtils.setField(jwtService, "expiration", EXPIRATION_FOR_TEST);

        testUser = new User();
        testUser.setUsername("testuser");
    }

    @Test
    @DisplayName("Deve gerar token JWT valido e nao nulo")
    void generateToken_shoulfCreateValidToken() {
        String token = jwtService.generateToken(testUser);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    @DisplayName("Deve extrair o username correto de um token válido")
    void extractUsername_shouldReturnCorrectUsername() {
        String token = jwtService.generateToken(testUser);

        String extractedUsername = jwtService.extractUsername(token);

        assertEquals(extractedUsername, testUser.getUsername());
    }

    @Test
    @DisplayName("isTokenValid: Deve retornar TRUE para um token válido")
    void isTokenValid() {
        String token = jwtService.generateToken(testUser);

        boolean isValid = jwtService.isTokenValid(token, testUser);

        assertTrue(isValid);
    }

    @Test
    @DisplayName("isTokenValid: Deve retornar FALSE para um token com username diferente")
    void isTokenValid_withMismatchedUser_shouldReturnFalse() {

        String token = jwtService.generateToken(testUser);
        User anotherUser = new User();
        anotherUser.setUsername("anotheruser@fastgondolas.com");

        boolean isValid = jwtService.isTokenValid(token, anotherUser);

        assertFalse(isValid);
    }

    @Test
    @DisplayName("isTokenValid: Deve lançar ExpiredJwtException para um token expirado")
    void isTokenValid_withExpiredToken_shouldThrowException() {
        ReflectionTestUtils.setField(jwtService, "expiration", -1000L);
        String expiredToken = jwtService.generateToken(testUser);

        assertThrows(ExpiredJwtException.class, () -> {
            jwtService.isTokenValid(expiredToken, testUser);
        });
    }

    @Test
    @DisplayName("extractUsername: Deve lançar SignatureException para um token com assinatura inválida")
    void extractUsername_withInvalidSignature_shouldThrowException() {
        String token = jwtService.generateToken(testUser);
        String invalidToken = token.substring(0, token.length() - 5) + "abcde";

        assertThrows(SignatureException.class, () -> {
            jwtService.extractUsername(invalidToken);
        });
    }
}