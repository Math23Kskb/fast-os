package br.com.fastgondolas.fastos.server.model;

import br.com.fastgondolas.fastos.server.dto.CategoriaDto;
import br.com.fastgondolas.fastos.server.dto.PecaPendenteDto;
import br.com.fastgondolas.fastos.server.model.OsStatus;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ordens_de_servico")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrdemDeServico extends BaseEntity{

    @Column(name = "numero_os")
    private String numeroOs;

    private String numeroSerieEquipamento;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "problema_detalhado", columnDefinition = "jsonb")
    private List<CategoriaDto> problemaDetalhado;

    private String diagnosticoTecnico;
    private String solucaoAplicada;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status")
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

    @OneToMany(mappedBy = "ordemDeServico", fetch = FetchType.LAZY)
    private List<Anexo> anexos;

    @ManyToMany(mappedBy = "ordensDeServico", fetch = FetchType.LAZY)
    private List<Visita> visitas;
}