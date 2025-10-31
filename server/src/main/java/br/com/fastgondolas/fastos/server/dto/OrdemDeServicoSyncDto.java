package br.com.fastgondolas.fastos.server.dto;

import br.com.fastgondolas.fastos.server.model.OsStatus;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record OrdemDeServicoSyncDto(
        UUID id,
        @JsonProperty("created_at")
        Instant createdAt,
        @JsonProperty("updated_at")
        Instant updatedAt,
        @JsonProperty("numero_os")
        String numeroOs,
        @JsonProperty("numero_serie_equipamento")
        String numeroSerieEquipamento,
        OsStatus status,
        @JsonProperty("problema_detalhado")
        List<CategoriaDto> problemaDetalhado,
        @JsonProperty("diagnostico_tecnico")
        String diagnosticoTecnico,
        @JsonProperty("solucao_aplicada")
        String solucaoAplicada,
        @JsonProperty("motivo_pausa")
        String motivoPausa,
        @JsonProperty("pecas_pendentes")
        List<PecaPendenteDto> pecasPendentes,
        @JsonProperty("descricao_pendencia")
        String descricaoPendencia,
        @JsonProperty("data_agendamento")
        Instant dataAgendamento,
        @JsonProperty("data_inicio_execucao")
        Instant dataInicioExecucao,
        @JsonProperty("data_fim_execucao")
        Instant dataFimExecucao,
        @JsonProperty("codigo_cliente_externo")
        String codigoClienteExterno,
        @JsonProperty("numero_pedido_externo")
        String numeroPedidoExterno,
        @JsonProperty("data_faturamento")
        LocalDate dataFaturamento,
        @JsonProperty("em_garantia")
        boolean emGarantia,
        @JsonProperty("cliente_id")
        UUID cliente_id,
        @JsonProperty("endereco_id")
        UUID endereco_id,
        @JsonProperty("tecnico_responsavel_id")
        UUID tecnico_responsavel_id
) {
}
