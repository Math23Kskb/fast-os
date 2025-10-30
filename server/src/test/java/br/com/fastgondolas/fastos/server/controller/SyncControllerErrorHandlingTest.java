package br.com.fastgondolas.fastos.server.controller;

import br.com.fastgondolas.fastos.server.BaseIntegrationTest;
import br.com.fastgondolas.fastos.server.dto.OsStatusUpdateDto;
import br.com.fastgondolas.fastos.server.dto.PushChangesDto;
import br.com.fastgondolas.fastos.server.exception.ResourceNotFoundException;
import br.com.fastgondolas.fastos.server.model.User;
import br.com.fastgondolas.fastos.server.model.UserRole;
import br.com.fastgondolas.fastos.server.service.SyncService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
public class SyncControllerErrorHandlingTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SyncService syncService;

    private User tecnicoUser;

    @BeforeEach
    void setUp() {
        tecnicoUser = new User();
        tecnicoUser.setUsername("sync-error-test@example.com");
        tecnicoUser.setRole(UserRole.TECNICO);
    }

    @Test
    @DisplayName("POST /sync - Deve retornar 404 Not Found ao tentar atualizar um recurso inexistente")
    void pushChanges_whenUpdatingNonExistentResource_shouldReturnNotFound() throws Exception {
        // Arrange
        UUID idInexistente = UUID.randomUUID();
        var osUpdateDto = new OsStatusUpdateDto(idInexistente, "CONCLUIDA");
        var pushPayload = new PushChangesDto(List.of(osUpdateDto), null, null);

        // Configure o mock para lançar a exceção quando o método pushChanges for chamado.
        // Usamos doThrow() para métodos que retornam 'void'.
        doThrow(new ResourceNotFoundException("OS não encontrada: " + idInexistente))
                .when(syncService)
                .pushChanges(any(User.class), any(PushChangesDto.class));

        // Act & Assert
        mockMvc.perform(post("/api/v1/sync")
                        .with(user(tecnicoUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pushPayload)))
                .andExpect(status().isNotFound()); // Verifica se o GlobalExceptionHandler retornou 404
    }
}