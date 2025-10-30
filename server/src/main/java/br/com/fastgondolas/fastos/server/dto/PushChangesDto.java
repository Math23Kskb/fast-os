package br.com.fastgondolas.fastos.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.UUID;

public record PushChangesDto(
        @JsonProperty("ordens_de_servico_updated") List<OsStatusUpdateDto> ordensDeServicoUpdated,
        @JsonProperty("visitas_created") List<VisitaCreateDto> visitasCreated,
        @JsonProperty("visitas_deleted") List<UUID> visitasDeleted
) {
}
