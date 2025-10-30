package br.com.fastgondolas.fastos.server.model;

import br.com.fastgondolas.fastos.server.model.AnexoTipo;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "anexos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Anexo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String urlArquivo;

    @Enumerated(EnumType.STRING)
    private AnexoTipo tipoArquivo;

    private String descricao;

    @Builder.Default
    private Instant criadoEm = Instant.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ordem_de_servico_id", nullable = false)
    private OrdemDeServico ordemDeServico;
}