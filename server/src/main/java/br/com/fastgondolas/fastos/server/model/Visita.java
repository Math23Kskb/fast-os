package br.com.fastgondolas.fastos.server.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "visitas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Visita extends BaseEntity {

    private String status;

    private Instant dataSaidaEmpresa;
    private Instant dataChegadaCliente;
    private Instant dataSaidaCliente;
    private Instant dataChegadaEmpresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tecnico_id", nullable = false)
    private User tecnico;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "endereco_id", nullable = false)
    private Endereco endereco;

    @ManyToMany
    @JoinTable(
            name = "visita_ordens_de_servico",
            joinColumns = @JoinColumn(name = "visita_id"),
            inverseJoinColumns = @JoinColumn(name = "ordem_de_servico_id")
    )
    private List<OrdemDeServico> ordensDeServico;
}