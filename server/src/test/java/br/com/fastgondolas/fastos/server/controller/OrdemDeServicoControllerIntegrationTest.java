package br.com.fastgondolas.fastos.server.controller;

import br.com.fastgondolas.fastos.server.BaseIntegrationTest;
import br.com.fastgondolas.fastos.server.exception.ResourceNotFoundException;
import br.com.fastgondolas.fastos.server.model.User;
import br.com.fastgondolas.fastos.server.model.UserRole;
import br.com.fastgondolas.fastos.server.service.OrdemDeServicoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
class OrdemDeServicoControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OrdemDeServicoService ordemDeServicoService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUsername("os-test-user@example.com");
        testUser.setRole(UserRole.TECNICO);
    }

    @Test
    @DisplayName("GET /ordens-de-servico/{id} - Deve retornar 404 Not Found quando a OS não existe")
    void getById_whenOsNotFound_shouldReturnNotFound() throws Exception {
        UUID idInexistente = UUID.randomUUID();

        when(ordemDeServicoService.findById(idInexistente))
                .thenThrow(new ResourceNotFoundException("Ordem de Serviço não encontrada..."));

        mockMvc.perform(get("/api/v1/ordens-de-servico/{id}", idInexistente)
                        .with(user(testUser)))
                .andExpect(status().isNotFound());
    }
}