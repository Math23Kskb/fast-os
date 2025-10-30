package br.com.fastgondolas.fastos.server.dto;

import br.com.fastgondolas.fastos.server.model.AnexoTipo;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.UUID;

public record AnexoSyncDto(
        UUID id,
        @JsonProperty("created_at")
        Instant createdAt,
        @JsonProperty("updated_at")
        Instant updatedAt,
        @JsonProperty("url_arquivo")
        String urlArquivo,
        @JsonProperty("tipo_arquivo")
        AnexoTipo tipoArquivo,
        String descricao,
        @JsonProperty("ordem_de_servico_id")
        UUID ordem_de_servico_id
) {
}
