package br.com.fastgondolas.fastos.server.controller;

import br.com.fastgondolas.fastos.server.BaseIntegrationTest;
import br.com.fastgondolas.fastos.server.exception.ResourceNotFoundException;
import br.com.fastgondolas.fastos.server.model.*;
import br.com.fastgondolas.fastos.server.repository.*;
import br.com.fastgondolas.fastos.server.service.SyncService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
class SyncControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;
    @Autowired private TecnicoRepository tecnicoRepository;
    @Autowired private ClienteRepository clienteRepository;
    @Autowired private EnderecoRepository enderecoRepository;
    @Autowired private VisitaRepository visitaRepository;
    @Autowired private OrdemDeServicoRepository osRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    private User tecnicoUser;

    @BeforeEach
    void setUp() {
        osRepository.deleteAll();
        visitaRepository.deleteAll();
        enderecoRepository.deleteAll();
        clienteRepository.deleteAll();
        userRepository.deleteAll();
        tecnicoRepository.deleteAll();

        Tecnico tecnico = tecnicoRepository.save(Tecnico.builder().nome("Tecnico Teste Sync").build());

        tecnicoUser = new User();
        tecnicoUser.setUsername("sync.user@test.com");
        tecnicoUser.setPassword(passwordEncoder.encode("password"));
        tecnicoUser.setEmail("sync.user@test.com");
        tecnicoUser.setRole(UserRole.TECNICO);
        tecnicoUser.setTecnico(tecnico);
        userRepository.save(tecnicoUser);

        Cliente cliente = clienteRepository.save(Cliente.builder().nome("Cliente Teste Sync").build());
        Endereco endereco = enderecoRepository.save(Endereco.builder().cliente(cliente).cidade("Cidade Teste").estado("TS").logradouro("Rua").build());

        Visita visita = visitaRepository.save(Visita.builder().tecnico(tecnicoUser).endereco(endereco).status("AGENDADA").build());

        osRepository.save(OrdemDeServico.builder()
                .numeroOs("SYNC-OS-001")
                .tecnicoResponsavel(tecnicoUser)
                .cliente(cliente)
                .endereco(endereco)
                .status(OsStatus.AGENDADA)
                .build());
    }

    @Test
    @DisplayName("GET /sync - Primeira Sincronização: Deve retornar todos os registros em 'created'")
    void pullChanges_firstSync_shouldReturnAllRecordsInCreated() throws Exception {
        mockMvc.perform(get("/api/v1/sync")
                        .with(user(tecnicoUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.timestamp").isNumber())
                .andExpect(jsonPath("$.changes.tecnicos.created.length()").value(1))
                .andExpect(jsonPath("$.changes.clientes.created.length()").value(1))
                .andExpect(jsonPath("$.changes.enderecos.created.length()").value(1))
                .andExpect(jsonPath("$.changes.visitas.created.length()").value(1))
                .andExpect(jsonPath("$.changes.ordensDeServico.created.length()").value(1))
                .andExpect(jsonPath("$.changes.ordensDeServico.created[0].numero_os").value("SYNC-OS-001"));
    }

    @Test
    @DisplayName("GET /sync - Sincronização Incremental: Deve retornar nenhuma mudança se o timestamp for recente")
    void pullChanges_incrementalSync_shouldReturnNoChanges() throws Exception {
        Thread.sleep(10);
        long nowTimestamp = System.currentTimeMillis();

        mockMvc.perform(get("/api/v1/sync")
                        .param("last_pulled_at", String.valueOf(nowTimestamp))
                        .with(user(tecnicoUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.timestamp").isNumber())
                .andExpect(jsonPath("$.changes.clientes.created.length()").value(0))
                .andExpect(jsonPath("$.changes.clientes.updated.length()").value(0))
                .andExpect(jsonPath("$.changes.visitas.created.length()").value(0))
                .andExpect(jsonPath("$.changes.visitas.updated.length()").value(0))
                .andExpect(jsonPath("$.changes.ordensDeServico.created.length()").value(0))
                .andExpect(jsonPath("$.changes.ordensDeServico.updated.length()").value(0));
    }


    @Test
    @DisplayName("GET /sync - Teste de Atualização: Deve retornar registros atualizados em 'updated'")
    void pullChanges_withUpdates_shouldReturnRecordsInUpdated() throws Exception {
        long initialTimestamp = System.currentTimeMillis();
        Thread.sleep(10);

        Cliente cliente = clienteRepository.findAll().get(0);
        cliente.setNome("Cliente com Nome Atualizado");
        clienteRepository.save(cliente);

        mockMvc.perform(get("/api/v1/sync")
                        .param("last_pulled_at", String.valueOf(initialTimestamp))
                        .with(user(tecnicoUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.timestamp").isNumber())
                .andExpect(jsonPath("$.changes.clientes.created.length()").value(0))
                .andExpect(jsonPath("$.changes.clientes.updated.length()").value(1))
                .andExpect(jsonPath("$.changes.clientes.updated[0].nome").value("Cliente com Nome Atualizado"));
    }
}