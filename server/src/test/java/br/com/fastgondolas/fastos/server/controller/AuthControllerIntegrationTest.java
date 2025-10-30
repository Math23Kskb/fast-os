package br.com.fastgondolas.fastos.server.controller;

import br.com.fastgondolas.fastos.server.BaseIntegrationTest;
import br.com.fastgondolas.fastos.server.dto.LoginRequestDto;
import br.com.fastgondolas.fastos.server.dto.RegisterUserDto;
import br.com.fastgondolas.fastos.server.exception.UserAlreadyExistsException;
import br.com.fastgondolas.fastos.server.model.User;
import br.com.fastgondolas.fastos.server.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
class AuthControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    UserService userService;

    private static final String AUTH_URL = "/api/v1/auth";

    @Test
    @DisplayName("POST /register - Deve retornar 201 Created quando os dados do usuário são válidos")
    void whenRegisterNewUserWithValidData_shouldReturnStatusCreatedAndUser() throws Exception {
        var newUserDto = new RegisterUserDto("testuser", "password123", "test@example.com");

        var savedUser = new User();
        savedUser.setUsername(newUserDto.username());
        savedUser.setEmail(newUserDto.email());

        when(userService.registerUser(any(User.class))).thenReturn(savedUser);

        mockMvc.perform(post(AUTH_URL + "/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUserDto)))
                .andExpect(status().isCreated()) // Status 201
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.password").doesNotExist()); // Confirma que a senha não foi exposta
    }

    @Test
    @DisplayName("POST /register - Deve retornar 400 Bad Request para dados inválidos (ex: username em branco)")
    void whenRegisterUserWithInvalidData_shouldReturnBadRequest() throws Exception {
        var invalidDto = new RegisterUserDto("", "password123", "invalid@example.com");

        mockMvc.perform(post(AUTH_URL + "/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /register - Deve retornar 409 Conflict quando o usuário já existe")
    void register_whenUserAlreadyExists_shouldReturnConflict() throws Exception {
        var newUserDto = new RegisterUserDto("existinguser", "password123", "existing@email.com");

        when(userService.registerUser(any(User.class)))
                .thenThrow(new UserAlreadyExistsException("Usuário já cadastrado."));

        mockMvc.perform(post(AUTH_URL + "/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUserDto)))
                .andExpect(status().isConflict()); // 409 Conflict
    }

    @Test
    @DisplayName("POST /login - Deve retornar 401 Unauthorized para credenciais inválidas")
    void login_withInvalidCredentials_shouldReturnUnauthorized() throws Exception {
        var loginDto = new LoginRequestDto("user", "wrongpassword");

        when(userService.loginUser(any(LoginRequestDto.class)))
                .thenThrow(new BadCredentialsException("Usuário ou senha inválida"));

        mockMvc.perform(post(AUTH_URL + "/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isUnauthorized()); // 401 Unauthorized
    }

    @Test
    @DisplayName("POST /login - Deve retornar 200 OK e um token com credenciais válidas")
    void login_comCredenciaisValidas_deveRetornarOkEToken() throws Exception {
        var loginDto = new LoginRequestDto("user@test.com", "password123");
        String tokenFalso = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        when(userService.loginUser(any(LoginRequestDto.class))).thenReturn(tokenFalso);

        mockMvc.perform(post(AUTH_URL + "/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(tokenFalso));
    }

    @Test
    @DisplayName("GET /hash/{password} - Deve retornar 200 OK e o hash da senha")
    void getHash_deveRetornarOk() throws Exception {
        String senhaPlana = "minhaSenhaSecreta";


        mockMvc.perform(get(AUTH_URL + "/hash/{password}", senhaPlana))
                .andExpect(status().isOk());
    }

}