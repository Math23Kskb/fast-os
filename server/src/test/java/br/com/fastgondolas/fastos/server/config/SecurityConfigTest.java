package br.com.fastgondolas.fastos.server.config;

import br.com.fastgondolas.fastos.server.BaseIntegrationTest;
import br.com.fastgondolas.fastos.server.model.Tecnico;
import br.com.fastgondolas.fastos.server.model.User;
import br.com.fastgondolas.fastos.server.model.UserRole;
import br.com.fastgondolas.fastos.server.repository.*;
import br.com.fastgondolas.fastos.server.service.JwtService;
import org.flywaydb.core.internal.jdbc.JdbcTemplate;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach; // Importe
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext; // Importe
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_CLASS)
class SecurityConfigTest extends BaseIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private JwtService jwtService;
    @Autowired private UserRepository userRepository;
    @Autowired private TecnicoRepository tecnicoRepository;

    private Tecnico tecnicoDeTeste;

    @BeforeEach
    void setUp() {
        Tecnico tecnico = new Tecnico();
        tecnico.setNome("Tecnico de Teste de Seguranca");
        this.tecnicoDeTeste = tecnicoRepository.saveAndFlush(tecnico);
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
        tecnicoRepository.deleteAll();
    }

    private User criarEsalvarUsuarioDeTeste() {
        String randomSuffix = UUID.randomUUID().toString().substring(0, 8);

        User user = new User();
        user.setUsername("securityuser-" + randomSuffix);
        user.setEmail("security-user-" + randomSuffix + "@test.com");
        user.setPassword("senhaCriptografada");
        user.setRole(UserRole.TECNICO);
        user.setTecnico(this.tecnicoDeTeste);

        return userRepository.saveAndFlush(user);
    }


    @Test
    void quandoAcessarEndpointProtegidoSemAutenticacao_deveRetornarInautorizado() throws Exception {
        mockMvc.perform(get("/api/v1/ordens-de-servico/{id}", UUID.randomUUID()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void quandoAcessarSwaggerUi_devePermitirAcesso() throws Exception {
        mockMvc.perform(get("/swagger-ui.html"))
                .andExpect(status().is3xxRedirection());
    }

    @Test
    void quandoAcessarEndPointNaoListado_deveNegarAcesso() throws Exception {
        mockMvc.perform(get("/admin/dashboard"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Deve PERMITIR acesso a endpoint protegido com um token JWT válido")
    void quandoAcessarComTokenValido_devePermitirAcesso() throws Exception {
        User testUser = criarEsalvarUsuarioDeTeste();
        String jwtToken = jwtService.generateToken(testUser);

        mockMvc.perform(get("/api/v1/ordens-de-servico/{id}", UUID.randomUUID())
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Deve NEGAR acesso a endpoint protegido com um token JWT inválido (assinatura errada)")
    void quandoAcessarComTokenInvalido_deveNegarAcesso() throws Exception {
        String tokenInvalido = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzZWN1cml0eS11c2VyQHRlc3QuY29tIiwiaWF0IjoxNjE2MjU5MjIyfQ.invalidSignature";

        mockMvc.perform(get("/api/v1/ordens-de-servico/{id}", UUID.randomUUID())
                        .header("Authorization", "Bearer " + tokenInvalido))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Deve NEGAR acesso a endpoint protegido com um cabeçalho mal formatado (sem 'Bearer ')")
    void quandoAcessarComHeaderMalFormatado_deveNegarAcesso() throws Exception {

        User testUser = criarEsalvarUsuarioDeTeste();
        String jwtToken = jwtService.generateToken(testUser);

        mockMvc.perform(get("/api/v1/ordens-de-servico/{id}", UUID.randomUUID())
                        .header("Authorization", jwtToken))
                .andExpect(status().isUnauthorized());
    }
}