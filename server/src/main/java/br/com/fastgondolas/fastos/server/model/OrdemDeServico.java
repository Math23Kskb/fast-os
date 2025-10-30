package br.com.fastgondolas.fastos.server.model;

import br.com.fastgondolas.fastos.server.dto.ProblemaDetalhadoDto;
import br.com.fastgondolas.fastos.server.dto.PecaPendenteDto;
import br.com.fastgondolas.fastos.server.model.OsStatus;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ordens_de_servico")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrdemDeServico {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "numero_os")
    private Long numeroOs;

    private String numeroSerieEquipamento;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private List<ProblemaDetalhadoDto> problemaDetalhado;

    private String diagnosticoTecnico;
    private String solucaoAplicada;

    @Enumerated(EnumType.STRING)
    private OsStatus status;

    private String motivoPausa;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private List<PecaPendenteDto> pecasPendentes;

    private String descricaoPendencia;
    private Instant dataAgendamento;
    private Instant dataInicioExecucao;
    private Instant dataFimExecucao;
    private String codigoClienteExterno;
    private String numeroPedidoExterno;
    private LocalDate dataFaturamento;
    private boolean emGarantia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "endereco_id")
    private Endereco endereco;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tecnico_responsavel_id")
    private User tecnicoResponsavel;
}