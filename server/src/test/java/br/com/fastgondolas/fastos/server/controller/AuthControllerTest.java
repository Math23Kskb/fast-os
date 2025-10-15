package br.com.fastgondolas.fastos.server.controller;

import br.com.fastgondolas.fastos.server.dto.RegisterUserDto;
import br.com.fastgondolas.fastos.server.model.User;
import br.com.fastgondolas.fastos.server.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    UserService userService;

    @Test
    void whenRegisterNewUserWithValidData_shouldReturnStatusCreatedAndUser() throws Exception {

        RegisterUserDto newUserDto = new RegisterUserDto("testuser", "password123", "test@example.com");

        User savedUser = new User(UUID.randomUUID(), "testuser", "password123", "test@example.com");
        when(userService.registerUser(any(User.class))).thenReturn(savedUser);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newUserDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.password").doesNotExist());

    }

    @Test
    void whenRegisterUserWithInvalidData_shouldReturnBadRequest() throws Exception {
        RegisterUserDto invalidDto = new RegisterUserDto("", "password123", "invalid@example.com");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }

}